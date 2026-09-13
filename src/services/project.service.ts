import { prisma } from "@/lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "@/lib/validations";
import { ActivityType, ProjectRole } from "@prisma/client";
import { canEditProject, canManageProject, getProjectMembership } from "@/lib/permissions";
import { ActivityService } from "./activity.service";

export class ProjectService {
  /**
   * Get all projects where the user is a member
   */
  static async getProjects(
    userId: string, 
    filters?: { status?: string, priority?: string, search?: string }
  ) {
    const whereClause: any = {
      members: {
        some: {
          userId,
        },
      },
    };

    if (filters?.status) {
      whereClause.status = filters.status;
    }
    
    if (filters?.priority) {
      whereClause.priority = filters.priority;
    }

    if (filters?.search) {
      whereClause.name = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    return await prisma.project.findMany({
      where: whereClause,
      include: {
        owner: {
          select: { name: true, email: true, avatarUrl: true },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get project details if the user is a member
   */
  static async getProjectDetails(projectId: string, userId: string) {
    const membership = await getProjectMembership(userId, projectId);
    
    if (!membership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    return await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: { name: true, email: true, avatarUrl: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });
  }

  /**
   * Create a new project. The creator becomes the owner and is added as a member.
   */
  static async createProject(userId: string, userName: string, data: CreateProjectInput) {
    return await prisma.$transaction(async (tx) => {
      // Create project
      const project = await tx.project.create({
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
          priority: data.priority,
          startDate: data.startDate ? new Date(data.startDate) : null,
          deadline: data.deadline ? new Date(data.deadline) : null,
          ownerId: userId,
        },
      });

      // Add owner as a project member with OWNER role
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: userId,
          role: ProjectRole.OWNER,
        },
      });

      // Log activity
      await ActivityService.logActivity(tx, {
        type: ActivityType.PROJECT_CREATED,
        description: ActivityService.buildDescription(ActivityType.PROJECT_CREATED, userName, project.name),
        projectId: project.id,
        userId: userId,
      });

      return project;
    });
  }

  /**
   * Update an existing project
   */
  static async updateProject(projectId: string, userId: string, userName: string, data: UpdateProjectInput) {
    const membership = await getProjectMembership(userId, projectId);
    
    if (!membership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    if (!canEditProject(membership.role)) {
      throw new Error("Forbidden: Insufficient permissions to edit project");
    }

    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: projectId },
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
          priority: data.priority,
          startDate: data.startDate ? new Date(data.startDate) : (data.startDate === null ? null : undefined),
          deadline: data.deadline ? new Date(data.deadline) : (data.deadline === null ? null : undefined),
        },
      });

      await ActivityService.logActivity(tx, {
        type: ActivityType.PROJECT_UPDATED,
        description: ActivityService.buildDescription(ActivityType.PROJECT_UPDATED, userName, project.name),
        projectId: project.id,
        userId: userId,
      });

      return project;
    });
  }

  /**
   * Delete a project
   */
  static async deleteProject(projectId: string, userId: string) {
    const membership = await getProjectMembership(userId, projectId);
    
    if (!membership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    if (!canManageProject(membership.role)) {
      throw new Error("Forbidden: Only project owners can delete the project");
    }

    // Because of onDelete: Cascade, deleting the project deletes its members, tasks, comments, etc.
    return await prisma.project.delete({
      where: { id: projectId },
    });
  }
}

