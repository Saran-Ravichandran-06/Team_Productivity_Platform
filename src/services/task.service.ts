import { prisma } from "@/lib/prisma";
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from "@/lib/validations";
import { canCreateTask, canUpdateTask, canDeleteTask, getProjectMembership } from "@/lib/permissions";
import { Prisma, ActivityType, TaskStatus } from "@prisma/client";
import { ActivityService } from "./activity.service";

export class TaskService {
  /**
   * Helper to verify if a user belongs to a project.
   */
  private static async verifyProjectMembership(userId: string, projectId: string) {
    const membership = await getProjectMembership(userId, projectId);
    if (!membership) {
      throw new Error("Forbidden: Not a member of this project");
    }
    return membership;
  }

  /**
   * Helper to verify if an assignee belongs to the project.
   */
  private static async verifyAssigneeMembership(assigneeId: string, projectId: string) {
    const membership = await getProjectMembership(assigneeId, projectId);
    if (!membership) {
      throw new Error("Bad Request: Assignee is not a member of this project");
    }
  }

  /**
   * List tasks for a project with filtering, searching, and pagination.
   */
  static async listTasks(projectId: string, userId: string, query: TaskQueryInput) {
    await this.verifyProjectMembership(userId, projectId);

    const { search, status, priority, assigneeId, page, pageSize, sort, sortDir } = query;

    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assigneeId && { assigneeId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const skip = (page - 1) * pageSize;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sort]: sortDir },
        include: {
          creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
          assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get a single task by ID.
   */
  static async getTaskById(projectId: string, taskId: string, userId: string) {
    await this.verifyProjectMembership(userId, projectId);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        project: { select: { id: true, name: true, status: true } },
      },
    });

    if (!task || task.projectId !== projectId) {
      throw new Error("Not Found: Task does not exist in this project");
    }

    return task;
  }

  /**
   * Create a new task.
   */
  static async createTask(projectId: string, creatorId: string, creatorName: string, data: CreateTaskInput) {
    const membership = await this.verifyProjectMembership(creatorId, projectId);

    if (!canCreateTask(membership.role)) {
      throw new Error("Forbidden: Insufficient permissions to create task");
    }

    if (data.assigneeId) {
      await this.verifyAssigneeMembership(data.assigneeId, projectId);
    }

    return await prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          projectId,
          creatorId,
          assigneeId: data.assigneeId || null,
        },
        include: {
          creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
          assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      });

      await ActivityService.logActivity(tx, {
        type: ActivityType.TASK_CREATED,
        description: ActivityService.buildDescription(ActivityType.TASK_CREATED, creatorName, task.title),
        projectId,
        taskId: task.id,
        userId: creatorId,
      });

      // Notifications
      if (task.assigneeId && task.assigneeId !== creatorId) {
        await tx.notification.create({
          data: {
            type: "TASK_ASSIGNED",
            message: `You were assigned the task "${task.title}" by ${creatorName}.`,
            recipientId: task.assigneeId,
            projectId,
            taskId: task.id,
          }
        });
      }

      return task;
    });
  }

  /**
   * Update an existing task.
   */
  static async updateTask(projectId: string, userId: string, userName: string, taskId: string, data: UpdateTaskInput) {
    const membership = await this.verifyProjectMembership(userId, projectId);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    if (!task || task.projectId !== projectId) {
      throw new Error("Not Found: Task does not exist in this project");
    }

    if (!canUpdateTask(membership.role, userId, task.creatorId, task.assigneeId)) {
      throw new Error("Forbidden: Insufficient permissions to update this task");
    }

    if (data.assigneeId && data.assigneeId !== task.assigneeId) {
      await this.verifyAssigneeMembership(data.assigneeId, projectId);
    }

    return await prisma.$transaction(async (tx) => {
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : (data.dueDate === null ? null : undefined),
          assigneeId: data.assigneeId === null ? null : (data.assigneeId || undefined),
        },
        include: {
          creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
          assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      });

      // Figure out what changed to log accurate activities
      const activities: { type: ActivityType, description: string }[] = [];
      let generateTaskAssignedNotificationForId = null;
      let generateTaskUpdatedNotification = false;

      // Assignment changed
      if (data.assigneeId !== undefined && data.assigneeId !== task.assigneeId) {
        if (data.assigneeId === null) {
           activities.push({
             type: ActivityType.TASK_UPDATED,
             description: `${userName} unassigned task "${updatedTask.title}"`
           });
           generateTaskUpdatedNotification = true;
        } else {
           activities.push({
             type: ActivityType.TASK_ASSIGNED,
             description: ActivityService.buildDescription(ActivityType.TASK_ASSIGNED, userName, updatedTask.title, updatedTask.assignee?.name || updatedTask.assignee?.email || "someone")
           });
           generateTaskAssignedNotificationForId = data.assigneeId;
        }
      }

      // Status changed
      if (data.status !== undefined && data.status !== task.status) {
        if (data.status === TaskStatus.DONE) {
          activities.push({
            type: ActivityType.TASK_COMPLETED,
            description: ActivityService.buildDescription(ActivityType.TASK_COMPLETED, userName, updatedTask.title)
          });
        } else {
           activities.push({
             type: ActivityType.TASK_UPDATED,
             description: `${userName} moved task "${updatedTask.title}" to ${data.status.replace("_", " ")}`
           });
        }
        generateTaskUpdatedNotification = true;
      }

      // General update fallback if nothing specific was caught but fields were updated
      if (activities.length === 0 && (
        data.title !== undefined || 
        data.description !== undefined || 
        data.priority !== undefined || 
        data.dueDate !== undefined
      )) {
         activities.push({
           type: ActivityType.TASK_UPDATED,
           description: ActivityService.buildDescription(ActivityType.TASK_UPDATED, userName, updatedTask.title)
         });
         generateTaskUpdatedNotification = true;
      }

      // Save activities atomically
      for (const act of activities) {
        await ActivityService.logActivity(tx, {
          type: act.type,
          description: act.description,
          projectId,
          taskId: updatedTask.id,
          userId,
        });
      }

      // Notifications
      if (generateTaskAssignedNotificationForId && generateTaskAssignedNotificationForId !== userId) {
        await tx.notification.create({
          data: {
            type: "TASK_ASSIGNED",
            message: `You were assigned the task "${updatedTask.title}" by ${userName}.`,
            recipientId: generateTaskAssignedNotificationForId,
            projectId,
            taskId: updatedTask.id,
          }
        });
      }
      
      // If the task was updated (not just assigned), notify the assignee if they aren't the one making the update
      if (generateTaskUpdatedNotification && updatedTask.assigneeId && updatedTask.assigneeId !== userId) {
        await tx.notification.create({
          data: {
            type: "TASK_UPDATED",
            message: `The task "${updatedTask.title}" was updated by ${userName}.`,
            recipientId: updatedTask.assigneeId,
            projectId,
            taskId: updatedTask.id,
          }
        });
      }

      return updatedTask;
    });
  }

  /**
   * Delete a task.
   */
  static async deleteTask(projectId: string, userId: string, taskId: string) {
    const membership = await this.verifyProjectMembership(userId, projectId);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.projectId !== projectId) {
      throw new Error("Not Found: Task does not exist in this project");
    }

    if (!canDeleteTask(membership.role, userId, task.creatorId)) {
      throw new Error("Forbidden: Insufficient permissions to delete this task");
    }

    return await prisma.task.delete({
      where: { id: taskId },
    });
  }
}
