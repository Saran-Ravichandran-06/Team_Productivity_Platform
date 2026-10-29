import { NotificationType } from "@prisma/client";
import { UserCheck, ClipboardEdit, MessageCircle, UserPlus, Clock } from "lucide-react";
import React from "react";
import { formatRelativeTime as formatRelativeTimeBase } from "./date-utils";

export function getNotificationIcon(type: NotificationType): React.ElementType {
  switch (type) {
    case NotificationType.TASK_ASSIGNED:
      return UserCheck;
    case NotificationType.TASK_UPDATED:
      return ClipboardEdit;
    case NotificationType.COMMENT_ADDED:
      return MessageCircle;
    case NotificationType.PROJECT_INVITATION:
      return UserPlus;
    case NotificationType.DEADLINE_REMINDER:
      return Clock;
    default:
      return MessageCircle;
  }
}

export function getNotificationLink(notification: { type: NotificationType, projectId?: string | null, taskId?: string | null }): string {
  if (notification.taskId && notification.projectId) {
    return `/dashboard/projects/${notification.projectId}/tasks/${notification.taskId}`;
  }
  
  if (notification.projectId) {
    return `/dashboard/projects/${notification.projectId}`;
  }
  
  return "/dashboard/notifications";
}

export function formatRelativeTime(dateString: string | Date): string {
  return formatRelativeTimeBase(dateString, { compact: true });
}
