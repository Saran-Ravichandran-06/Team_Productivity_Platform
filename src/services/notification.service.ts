import { prisma } from "@/lib/prisma";
import { NotificationType, Prisma } from "@prisma/client";

export type CreateNotificationInput = {
  type: NotificationType;
  message: string;
  recipientId: string;
  projectId?: string;
  taskId?: string;
};

export class NotificationService {
  /**
   * Internal function to create a single notification.
   * Can accept an existing Prisma transaction client.
   */
  static async createNotification(
    tx: Prisma.TransactionClient,
    data: CreateNotificationInput
  ) {
    return await tx.notification.create({
      data: {
        type: data.type,
        message: data.message,
        recipientId: data.recipientId,
        projectId: data.projectId,
        taskId: data.taskId,
      },
    });
  }

  /**
   * Internal function to create multiple notifications.
   * Can accept an existing Prisma transaction client.
   */
  static async createNotifications(
    tx: Prisma.TransactionClient,
    data: CreateNotificationInput[]
  ) {
    if (data.length === 0) return { count: 0 };
    
    return await tx.notification.createMany({
      data: data.map((n) => ({
        type: n.type,
        message: n.message,
        recipientId: n.recipientId,
        projectId: n.projectId,
        taskId: n.taskId,
      })),
    });
  }

  /**
   * Get paginated notifications for a user.
   */
  static async getUserNotifications(userId: string, page: number = 1, pageSize: number = 20, unreadOnly: boolean = false) {
    const where: Prisma.NotificationWhereInput = {
      recipientId: userId,
      ...(unreadOnly ? { read: false } : {}),
    };

    const skip = (page - 1) * pageSize;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    };
  }

  /**
   * Get the unread count for a user.
   */
  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });
  }

  /**
   * Mark a single notification as read.
   */
  static async markAsRead(userId: string, notificationId: string) {
    // Only update if it belongs to the user and is currently unread
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipientId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  /**
   * Mark all notifications as read for a user.
   */
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}
