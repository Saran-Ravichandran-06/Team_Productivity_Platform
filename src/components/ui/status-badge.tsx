import { PROJECT_STATUS, TASK_STATUS } from "@/lib/constants";
import type { ProjectStatusType, TaskStatusType } from "@/lib/constants";

interface StatusBadgeProps {
  status: ProjectStatusType | TaskStatusType | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  let colorClass = "bg-muted text-muted-foreground";
  let label = status.replace(/_/g, " ");

  // Project Statuses
  if (status === PROJECT_STATUS.PLANNING) colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
  else if (status === PROJECT_STATUS.ACTIVE) colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
  else if (status === PROJECT_STATUS.COMPLETED) colorClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
  else if (status === PROJECT_STATUS.ARCHIVED) colorClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  
  // Task Statuses
  else if (status === TASK_STATUS.TODO) colorClass = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
  else if (status === TASK_STATUS.IN_PROGRESS) colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
  else if (status === TASK_STATUS.REVIEW) colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  else if (status === TASK_STATUS.DONE) colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";

  // Title case the label (e.g. "IN PROGRESS" -> "In Progress")
  label = label.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
      {label}
    </span>
  );
}
