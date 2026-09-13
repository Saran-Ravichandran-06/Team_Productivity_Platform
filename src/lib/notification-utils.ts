import { NotificationType } from "@prisma/client";
import { UserCheck, ClipboardEdit, MessageCircle, UserPlus, Clock } from "lucide-react";
import React from "react";

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
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
