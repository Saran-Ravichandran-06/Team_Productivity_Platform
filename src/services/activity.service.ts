import { prisma } from "@/lib/prisma";
import { ActivityType, Prisma } from "@prisma/client";
import { getProjectMembership, canViewActivity } from "@/lib/permissions";

export type CreateActivityInput = {
  type: ActivityType;
  description: string;
  projectId: string;
  taskId?: string;
  userId?: string;
};

export class ActivityService {
  /**
   * Centralized method to log an activity.
   * Can accept a Prisma transaction client (`tx`) to log atomically with the parent operation.
   */
  static async logActivity(
    tx: Prisma.TransactionClient | typeof prisma,
    data: CreateActivityInput
  ) {
    return await tx.activity.create({
      data: {
        type: data.type,
        description: data.description,
        projectId: data.projectId,
        taskId: data.taskId || null,
        userId: data.userId || null,
      },
    });
  }

  /**
   * Helper to format human-readable descriptions based on context.
   */
  static buildDescription(
    type: ActivityType,
    actorName: string,
    targetName: string,
    extraContext?: string
  ): string {
    switch (type) {
      case ActivityType.PROJECT_CREATED:
        return `${actorName} created the project "${targetName}"`;
      case ActivityType.PROJECT_UPDATED:
        return `${actorName} updated the project "${targetName}"`;
      case ActivityType.TASK_CREATED:
        return `${actorName} created task "${targetName}"`;
      case ActivityType.TASK_UPDATED:
        return `${actorName} updated task "${targetName}"`;
      case ActivityType.TASK_ASSIGNED:
        return `${actorName} assigned "${targetName}" to ${extraContext}`;
      case ActivityType.TASK_COMPLETED:
        return `${actorName} moved "${targetName}" to Done`;
      case ActivityType.COMMENT_ADDED:
        return `${actorName} added a comment to "${targetName}"`;
      case ActivityType.MEMBER_ADDED:
        return `${actorName} added ${extraContext} to the project`;
      case ActivityType.MEMBER_REMOVED:
        return `${actorName} removed ${extraContext} from the project`;
      default:
        return `${actorName} performed an action on "${targetName}"`;
    }
  }

  /**
   * Fetch paginated project-level activity.
   */
  static async getProjectActivity(projectId: string, userId: string, page: number = 1, pageSize: number = 20) {
    const membership = await getProjectMembership(userId, projectId);
    if (!membership || !canViewActivity(membership.role)) {
      throw new Error("Forbidden: Cannot view project activity");
    }

    const skip = (page - 1) * pageSize;
    
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          task: { select: { id: true, title: true } },
        },
      }),
      prisma.activity.count({ where: { projectId } })
    ]);

    return {
      data: activities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Fetch paginated task-specific activity.
   */
  static async getTaskActivity(projectId: string, taskId: string, userId: string, page: number = 1, pageSize: number = 10) {
    const membership = await getProjectMembership(userId, projectId);
    if (!membership || !canViewActivity(membership.role)) {
      throw new Error("Forbidden: Cannot view project activity");
    }

    const skip = (page - 1) * pageSize;
    
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: { projectId, taskId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      }),
      prisma.activity.count({ where: { projectId, taskId } })
    ]);

    return {
      data: activities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
