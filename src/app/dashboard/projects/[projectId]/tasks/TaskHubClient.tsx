"use client";

import { useState } from "react";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskList } from "@/components/tasks/task-list";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function TaskHubClient({ projectId, initialTasks, pagination, members }: any) {
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
    <div className="flex flex-col h-full flex-1 min-h-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
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

      <TaskFilters members={members} viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="flex-1 min-h-0">
        {viewMode === "board" ? (
          <TaskBoard tasks={initialTasks} projectId={projectId} />
        ) : (
          <div className="flex flex-col h-full">
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
