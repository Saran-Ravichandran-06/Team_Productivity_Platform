"use client";

import { TASK_STATUS } from "@/lib/constants";
import { TaskCard } from "./task-card";
import { useRouter } from "next/navigation";
import { TaskItem } from "@/types/task";

type TaskBoardProps = {
  tasks: TaskItem[];
  projectId: string;
};

const COLUMNS = [
  { id: TASK_STATUS.TODO, title: "To Do" },
  { id: TASK_STATUS.IN_PROGRESS, title: "In Progress" },
  { id: TASK_STATUS.REVIEW, title: "Review" },
  { id: TASK_STATUS.DONE, title: "Done" },
];

export function TaskBoard({ tasks, projectId }: TaskBoardProps) {
  const router = useRouter();

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="flex gap-7 overflow-x-auto pb-4 h-full min-h-[400px] items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div key={column.id} className="flex-shrink-0 w-[280px] flex flex-col bg-muted/30 rounded-xl p-4 border max-h-[calc(100vh-250px)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
              {columnTasks.map((task) => (
                <div key={task.id} className="relative group">
                  <TaskCard task={task} projectId={projectId} />
                  
                  {/* Status Dropdown Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="text-xs border rounded-md px-1 py-1 bg-background shadow-sm focus:outline-none"
                      onClick={(e) => e.preventDefault()}
                    >
                      {COLUMNS.map((col) => (
                        <option key={col.id} value={col.id}>Move to {col.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground text-sm flex-1 flex items-center justify-center">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
