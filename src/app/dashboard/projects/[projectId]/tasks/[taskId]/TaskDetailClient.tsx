"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { TaskForm } from "@/components/tasks/task-form";
import { CommentList } from "@/components/comments/comment-list";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate, formatRelativeTime, formatDeadline } from "@/lib/date-utils";
import { TaskItem, TaskProjectMember } from "@/types/task";

type TaskDetailClientProps = {
  projectId: string;
  task: TaskItem;
  members: TaskProjectMember[];
  canEdit: boolean;
  canDelete: boolean;
  currentUserRole?: string;
  currentUserId?: string;
};

export function TaskDetailClient({ 
  projectId, 
  task, 
  members, 
  canEdit, 
  canDelete, 
  currentUserRole = "", 
  currentUserId = "" 
}: TaskDetailClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push(`/dashboard/projects/${projectId}/tasks`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete task");
        setIsDeleting(false);
      }
    } catch {
      alert("Error deleting task");
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Edit Task</h2>
        <TaskForm 
          projectId={projectId} 
          members={members} 
          initialData={task}
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  const deadlineInfo = formatDeadline(task.dueDate, task.status === "DONE");

  return (
    <div className="max-w-5xl mx-auto py-6">


      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold break-words">{task.title}</h1>
          <div className="flex items-center gap-3 mt-4">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {deadlineInfo.isOverdue && <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded">Overdue</span>}
            {deadlineInfo.isWarning && <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded">{deadlineInfo.text}</span>}
          </div>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" size="sm" onClick={() => setIsDeleting(true)} disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">Description</h3>
            <div className="text-foreground whitespace-pre-wrap">
              {task.description || <span className="text-muted-foreground italic">No description provided.</span>}
            </div>
          </div>

          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <CommentList 
              projectId={projectId} 
              taskId={task.id} 
              currentUserRole={currentUserRole}
              currentUserId={currentUserId}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <h3 className="font-semibold border-b pb-2 mb-4">Details</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Assignee</span>
                <div className="font-medium flex items-center gap-2">
                  {task.assignee ? (
                    <>{task.assignee.name}</>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Due Date</span>
                <div className={`font-medium ${deadlineInfo.isOverdue ? 'text-destructive' : ''}`}>
                  {formatDate(task.dueDate)}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Creator</span>
                <div className="font-medium">{task.creator?.name || "Unknown"}</div>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Created</span>
                <div className="font-medium">{formatRelativeTime(task.createdAt)}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground block mb-1">Last Updated</span>
                <div className="font-medium">{formatRelativeTime(task.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={isDeleting && canDelete}
        onOpenChange={(open) => !open && setIsDeleting(false)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone and will remove all associated comments and activity."
        confirmText="Delete Task"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
