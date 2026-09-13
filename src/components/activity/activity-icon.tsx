import { ActivityType } from "@prisma/client";
import {
  FolderOpen,
  Pencil,
  CheckCircle2,
  CheckSquare,
  Edit,
  UserPlus,
  UserMinus,
  MessageSquare,
  UserCheck,
  Activity
} from "lucide-react";

export function ActivityIcon({ type, className }: { type: ActivityType, className?: string }) {
  switch (type) {
    case ActivityType.PROJECT_CREATED:
      return <FolderOpen className={className} />;
    case ActivityType.PROJECT_UPDATED:
      return <Pencil className={className} />;
    case ActivityType.TASK_CREATED:
      return <CheckSquare className={className} />;
    case ActivityType.TASK_UPDATED:
      return <Edit className={className} />;
    case ActivityType.TASK_ASSIGNED:
      return <UserCheck className={className} />;
    case ActivityType.TASK_COMPLETED:
      return <CheckCircle2 className={className} />;
    case ActivityType.COMMENT_ADDED:
      return <MessageSquare className={className} />;
    case ActivityType.MEMBER_ADDED:
      return <UserPlus className={className} />;
    case ActivityType.MEMBER_REMOVED:
      return <UserMinus className={className} />;
    default:
      return <Activity className={className} />;
  }
}
