"use client";

import { useState } from "react";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskList } from "@/components/tasks/task-list";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TaskItem, TaskProjectMember } from "@/types/task";

type TaskHubClientProps = {
  projectId: string;
  initialTasks: TaskItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  members: TaskProjectMember[];
};

export function TaskHubClient({ projectId, initialTasks, pagination, members }: TaskHubClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {showCreateForm && (
        <div className="mb-4">
          <TaskForm 
            projectId={projectId} 
            members={members} 
            onSuccess={() => {
              setShowCreateForm(false);
              router.refresh();
            }} 
            onCancel={() => setShowCreateForm(false)} 
          />
        </div>
      )}

      <TaskFilters 
        members={members} 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
        onCreateTask={() => setShowCreateForm(true)}
      />

      <div className="flex-1 min-h-0">
        {viewMode === "board" ? (
          <TaskBoard tasks={initialTasks} projectId={projectId} />
        ) : (
          <div className="flex flex-col">
            <TaskList tasks={initialTasks} projectId={projectId} />
            
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
