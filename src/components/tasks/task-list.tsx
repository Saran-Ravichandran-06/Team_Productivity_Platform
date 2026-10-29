"use client";

import { TaskCard } from "./task-card";
import { TaskItem } from "@/types/task";

type TaskListProps = {
  tasks: TaskItem[];
  projectId: string;
};

export function TaskList({ tasks, projectId }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card border-dashed mt-8">
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-muted-foreground mt-2 mb-4">Create a task or change your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} projectId={projectId} showStatus={true} />
      ))}
    </div>
  );
}
