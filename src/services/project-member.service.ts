import { prisma } from "@/lib/prisma";
import { ActivityType, ProjectRole } from "@prisma/client";
import { canManageMembers, getProjectMembership } from "@/lib/permissions";
import { ActivityService } from "./activity.service";

export class ProjectMemberService {
  /**
   * Get all members for a project
   */
  static async getMembers(projectId: string, requesterId: string) {
    const membership = await getProjectMembership(requesterId, projectId);
    
    if (!membership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    return await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  /**
   * Add a member to a project
   */
  static async addMember(projectId: string, requesterId: string, requesterName: string, email: string, role: ProjectRole) {
    const membership = await getProjectMembership(requesterId, projectId);
    
    if (!membership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    if (!canManageMembers(membership.role)) {
      throw new Error("Forbidden: Insufficient permissions to add members");
    }

    if (role === ProjectRole.OWNER) {
      throw new Error("Cannot add a member as OWNER");
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!userToAdd) {
      throw new Error("User not found");
    }

    // Check if user is already a member
    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userToAdd.id,
        },
      },
    });

    if (existingMembership) {
      throw new Error("Conflict: User is already a member of this project");
    }

    return await prisma.$transaction(async (tx) => {
      const newMember = await tx.projectMember.create({
        data: {
          projectId,
          userId: userToAdd.id,
          role,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      });

      await ActivityService.logActivity(tx, {
        type: ActivityType.MEMBER_ADDED,
        description: ActivityService.buildDescription(ActivityType.MEMBER_ADDED, requesterName, "", userToAdd.name || userToAdd.email),
        projectId,
        userId: requesterId,
      });

      // Notification
      const project = await tx.project.findUnique({ where: { id: projectId }, select: { name: true } });
      if (project && userToAdd.id !== requesterId) {
        await tx.notification.create({
          data: {
            type: "PROJECT_INVITATION",
            message: `You were added to the project "${project.name}" by ${requesterName}.`,
            recipientId: userToAdd.id,
            projectId,
          }
        });
      }

      return newMember;
    });
  }

  /**
   * Update a member's role
   */
  static async updateRole(projectId: string, requesterId: string, requesterName: string, targetMemberId: string, newRole: ProjectRole) {
    const requesterMembership = await getProjectMembership(requesterId, projectId);
    
    if (!requesterMembership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    if (!canManageMembers(requesterMembership.role)) {
      throw new Error("Forbidden: Insufficient permissions to modify members");
    }

    if (newRole === ProjectRole.OWNER) {
      throw new Error("Forbidden: Cannot change role to OWNER");
    }

    const targetMembership = await prisma.projectMember.findUnique({
      where: { id: targetMemberId },
      include: { user: true }
    });

    if (!targetMembership || targetMembership.projectId !== projectId) {
      throw new Error("Member not found in this project");
    }

    if (targetMembership.role === ProjectRole.OWNER) {
      throw new Error("Forbidden: Cannot modify the OWNER's role");
    }

    return await prisma.$transaction(async (tx) => {
      const updatedMember = await tx.projectMember.update({
        where: { id: targetMemberId },
        data: { role: newRole },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      });

      await ActivityService.logActivity(tx, {
        type: ActivityType.PROJECT_UPDATED,
        description: `${requesterName} changed role of ${targetMembership.user.name || targetMembership.user.email} to ${newRole}`,
        projectId,
        userId: requesterId,
      });

      return updatedMember;
    });
  }

  /**
   * Remove a member from the project
   */
  static async removeMember(projectId: string, requesterId: string, requesterName: string, targetMemberId: string) {
    const requesterMembership = await getProjectMembership(requesterId, projectId);
    
    if (!requesterMembership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    if (!canManageMembers(requesterMembership.role)) {
      throw new Error("Forbidden: Insufficient permissions to remove members");
    }

    const targetMembership = await prisma.projectMember.findUnique({
      where: { id: targetMemberId },
      include: { user: true }
    });

    if (!targetMembership || targetMembership.projectId !== projectId) {
      throw new Error("Member not found in this project");
    }

    if (targetMembership.role === ProjectRole.OWNER) {
      throw new Error("Forbidden: Cannot remove the project OWNER");
    }

    return await prisma.$transaction(async (tx) => {
      await tx.projectMember.delete({
        where: { id: targetMemberId },
      });

      await ActivityService.logActivity(tx, {
        type: ActivityType.MEMBER_REMOVED,
        description: ActivityService.buildDescription(ActivityType.MEMBER_REMOVED, requesterName, "", targetMembership.user.name || targetMembership.user.email),
        projectId,
        userId: requesterId,
      });

      return { success: true };
    });
  }
}

