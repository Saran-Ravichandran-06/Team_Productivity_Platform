import type { ProjectPriorityType, TaskPriorityType } from "@/lib/constants";

interface PriorityBadgeProps {
  priority: ProjectPriorityType | TaskPriorityType | string;
  className?: string;
}

export function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
  let colorClass = "bg-muted text-muted-foreground";
  
  if (priority === "LOW") colorClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  else if (priority === "MEDIUM") colorClass = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  else if (priority === "HIGH") colorClass = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";

  const label = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
      {label}
    </span>
  );
}
