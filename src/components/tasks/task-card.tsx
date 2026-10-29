import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { formatDeadline } from "@/lib/date-utils";
import { TaskItem } from "@/types/task";

type TaskCardProps = {
  task: TaskItem;
  projectId: string;
  showStatus?: boolean;
};

export function TaskCard({ task, projectId, showStatus = false }: TaskCardProps) {
  const deadlineInfo = formatDeadline(task.dueDate, task.status === "DONE");

  return (
    <Link href={`/dashboard/projects/${projectId}/tasks/${task.id}`}>
      <div className={`border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-full ${deadlineInfo.isOverdue ? 'border-destructive/50' : ''}`}>
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          {showStatus && <StatusBadge status={task.status} />}
        </div>
        
        <div className="mt-4 flex-1 flex flex-col justify-end">
          <div className="flex justify-between items-center mt-2">
            <PriorityBadge priority={task.priority} />
            {task.assignee ? (
              <span className="text-xs bg-muted px-2 py-1 rounded-full truncate max-w-[100px]" title={task.assignee.name || undefined}>
                {task.assignee.name ? task.assignee.name.split(' ')[0] : 'Assigned'}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground border border-dashed px-2 py-1 rounded-full">
                Unassigned
              </span>
            )}
          </div>
          
          {task.dueDate && (
            <div className={`text-xs mt-3 ${deadlineInfo.isOverdue ? 'text-destructive font-medium' : deadlineInfo.isWarning ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
              Due: {deadlineInfo.text}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
