"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskInput } from "@/lib/validations";
import { TASK_STATUS, TASK_PRIORITY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { TaskItem, TaskProjectMember } from "@/types/task";

type TaskFormProps = {
  projectId: string;
  members: TaskProjectMember[];
  initialData?: TaskItem;
  onSuccess: () => void;
  onCancel: () => void;
};

export function TaskForm({ projectId, members, initialData, onSuccess, onCancel }: TaskFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!initialData;

  const defaultValues: Partial<CreateTaskInput> = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || TASK_STATUS.TODO,
    priority: initialData?.priority || TASK_PRIORITY.MEDIUM,
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    assigneeId: initialData?.assigneeId || undefined,
  };

  const { register, handleSubmit, formState: { errors } } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema) as Resolver<CreateTaskInput>,
    defaultValues,
  });

  const onSubmit = async (data: CreateTaskInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = isEdit ? `/api/projects/${projectId}/tasks/${initialData.id}` : `/api/projects/${projectId}/tasks`;
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        ...data,
        assigneeId: data.assigneeId === "" ? null : data.assigneeId,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to save task");
      } else {
        onSuccess();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card border rounded-xl p-6 shadow-sm">
      {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}

      <div>
        <label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
        <input 
          {...register("title")} 
          className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors mt-1" 
          disabled={isLoading}
        />
        {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea 
          {...register("description")} 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors mt-1" 
          disabled={isLoading}
        />
        {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Status</label>
          <select 
            {...register("status")} 
            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors mt-1"
            disabled={isLoading}
          >
            {Object.values(TASK_STATUS).map(status => (
              <option key={status} value={status}>{status.replace("_", " ")}</option>
            ))}
          </select>
          {errors.status && <p className="text-xs text-destructive mt-1">{errors.status.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Priority</label>
          <select 
            {...register("priority")} 
            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors mt-1"
            disabled={isLoading}
          >
            {Object.values(TASK_PRIORITY).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          {errors.priority && <p className="text-xs text-destructive mt-1">{errors.priority.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Assignee</label>
          <select 
            {...register("assigneeId")} 
            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors mt-1"
            disabled={isLoading}
          >
            <option value="">Unassigned</option>
            {members.map(member => (
              <option key={member.user.id} value={member.user.id}>{member.user.name}</option>
            ))}
          </select>
          {errors.assigneeId && <p className="text-xs text-destructive mt-1">{errors.assigneeId.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Due Date</label>
          <input 
            type="date"
            {...register("dueDate")} 
            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors mt-1"
            disabled={isLoading}
          />
          {errors.dueDate && <p className="text-xs text-destructive mt-1">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : isEdit ? "Update Task" : "Create Task"}</Button>
      </div>
    </form>
  );
}
