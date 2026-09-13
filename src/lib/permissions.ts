import { prisma } from "@/lib/prisma";
import { ProjectRole } from "@prisma/client";
import { getCurrentUser } from "./session";

/**
 * Validates if the given user is a member of the given project.
 * If true, returns the ProjectMember record including their role.
 */
export async function getProjectMembership(userId: string, projectId: string) {
  return await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });
}

/**
 * API Helper: Requires the current authenticated user to be a member of the specified project.
 * Throws an error (which should be caught and turned into 403) if not allowed.
 */
export async function requireProjectMember(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const membership = await getProjectMembership(user.id, projectId);
  if (!membership) throw new Error("Forbidden: Not a member of this project");

  return { user, membership };
}

// ------------------------------------------------------------------
// ROLE-BASED AUTHORIZATION HELPERS
// ------------------------------------------------------------------

export function isProjectOwner(role: ProjectRole) {
  return role === ProjectRole.OWNER;
}

export function isProjectAdmin(role: ProjectRole) {
  return role === ProjectRole.OWNER || role === ProjectRole.ADMIN;
}

export function isProjectMember(role: ProjectRole) {
  return role === ProjectRole.OWNER || role === ProjectRole.ADMIN || role === ProjectRole.MEMBER;
}

// ------------------------------------------------------------------
// FEATURE-SPECIFIC PERMISSION HELPERS
// ------------------------------------------------------------------

export function canManageProject(role: ProjectRole) {
  // Only OWNERs can delete or fully manage the project lifecycle (or ADMINs for editing)
  // According to requirements: "Do NOT allow ADMIN to Delete the project, Remove/change OWNER"
  return isProjectOwner(role);
}

export function canEditProject(role: ProjectRole) {
  return isProjectAdmin(role);
}

export function canManageMembers(role: ProjectRole) {
  // Both OWNER and ADMIN can add/remove members (with restrictions on removing OWNER)
  return isProjectAdmin(role);
}

export function canCreateTask(role: ProjectRole) {
  return isProjectMember(role);
}

export function canUpdateTask(role: ProjectRole, userId: string, taskCreatorId: string, taskAssigneeId: string | null) {
  if (isProjectAdmin(role)) return true; // OWNER and ADMIN can update any task
  if (role === ProjectRole.MEMBER) {
    return userId === taskCreatorId || userId === taskAssigneeId;
  }
  return false;
}

export function canDeleteTask(role: ProjectRole, userId: string, taskCreatorId: string) {
  if (isProjectAdmin(role)) return true; // OWNER and ADMIN can delete any task
  if (role === ProjectRole.MEMBER) {
    return userId === taskCreatorId; // MEMBER can only delete tasks they created
  }
  return false;
}

export function canAssignTask(role: ProjectRole) {
  return isProjectAdmin(role);
}

export function canEditComment(role: ProjectRole, userId: string, commentAuthorId: string) {
  if (isProjectAdmin(role)) return true; // OWNER and ADMIN can moderate
  return userId === commentAuthorId; // Member can edit their own
}

export function canDeleteComment(role: ProjectRole, userId: string, commentAuthorId: string) {
  if (isProjectAdmin(role)) return true; // OWNER and ADMIN can moderate
  return userId === commentAuthorId; // Member can delete their own
}

export function canViewActivity(role: ProjectRole) {
  return isProjectMember(role);
}
