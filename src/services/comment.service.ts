import { prisma } from "@/lib/prisma";
import { CreateCommentInput, UpdateCommentInput } from "@/lib/validations";
import { canEditComment, canDeleteComment, getProjectMembership } from "@/lib/permissions";
import { ActivityService } from "./activity.service";
import { ActivityType } from "@prisma/client";

export class CommentService {
  /**
   * Helper to verify if a user belongs to a project, and the task belongs to the project.
   */
  private static async verifyAccess(projectId: string, taskId: string, userId: string) {
    const membership = await getProjectMembership(userId, projectId);
    if (!membership) {
      throw new Error("Forbidden: Not a member of this project");
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, projectId: true, title: true }
    });

    if (!task || task.projectId !== projectId) {
      throw new Error("Not Found: Task does not exist in this project");
    }

    return { membership, task };
  }

  /**
   * Get all comments for a task
   */
  static async getComments(projectId: string, taskId: string, userId: string) {
    await this.verifyAccess(projectId, taskId, userId);

    return await prisma.comment.findMany({
      where: { taskId },
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } }
      },
      orderBy: { createdAt: "asc" }
    });
  }

  /**
   * Create a comment
   */
  static async createComment(projectId: string, taskId: string, userId: string, userName: string, data: CreateCommentInput) {
    const { task } = await this.verifyAccess(projectId, taskId, userId);

    return await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          content: data.content,
          taskId,
          authorId: userId,
        },
        include: {
          author: { select: { id: true, name: true, email: true, avatarUrl: true } }
        }
      });

      await ActivityService.logActivity(tx, {
        type: ActivityType.COMMENT_ADDED,
        description: ActivityService.buildDescription(ActivityType.COMMENT_ADDED, userName, task.title),
        projectId,
        taskId,
        userId,
      });

      // Notification
      const taskWithUsers = await tx.task.findUnique({
        where: { id: taskId },
        select: { creatorId: true, assigneeId: true }
      });
      
      if (taskWithUsers) {
        // Collect unique recipients (exclude commenter)
        const recipients = new Set<string>();
        if (taskWithUsers.creatorId !== userId) recipients.add(taskWithUsers.creatorId);
        if (taskWithUsers.assigneeId && taskWithUsers.assigneeId !== userId) recipients.add(taskWithUsers.assigneeId);
        
        if (recipients.size > 0) {
          const notificationData = Array.from(recipients).map(recipientId => ({
            type: "COMMENT_ADDED" as const,
            message: `${userName} commented on "${task.title}".`,
            recipientId,
            projectId,
            taskId,
          }));
          
          await tx.notification.createMany({
            data: notificationData
          });
        }
      }

      return comment;
    });
  }

  /**
   * Update a comment
   */
  static async updateComment(projectId: string, taskId: string, commentId: string, userId: string, data: UpdateCommentInput) {
    const { membership } = await this.verifyAccess(projectId, taskId, userId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment || comment.taskId !== taskId) {
      throw new Error("Not Found: Comment does not exist");
    }

    if (!canEditComment(membership.role, userId, comment.authorId)) {
      throw new Error("Forbidden: Insufficient permissions to edit this comment");
    }

    return await prisma.comment.update({
      where: { id: commentId },
      data: { content: data.content },
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } }
      }
    });
  }

  /**
   * Delete a comment
   */
  static async deleteComment(projectId: string, taskId: string, commentId: string, userId: string) {
    const { membership } = await this.verifyAccess(projectId, taskId, userId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment || comment.taskId !== taskId) {
      throw new Error("Not Found: Comment does not exist");
    }

    if (!canDeleteComment(membership.role, userId, comment.authorId)) {
      throw new Error("Forbidden: Insufficient permissions to delete this comment");
    }

    return await prisma.comment.delete({
      where: { id: commentId }
    });
  }
}
