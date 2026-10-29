"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  updateProjectSchema,
  CreateProjectInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { ProjectStatus, ProjectPriority } from "@prisma/client";

export type ProjectFormData = {
  id?: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: Date | string | null;
  deadline?: Date | string | null;
};

type ProjectFormProps = {
  initialData?: ProjectFormData;
  onSuccess: (projectId: string) => void;
  onCancel: () => void;
};

export function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatInitialDate = (dateVal?: Date | string | null) => {
    if (!dateVal) return undefined;
    return new Date(dateVal).toISOString().split("T")[0];
  };

  const defaultValues: Partial<CreateProjectInput> = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || ProjectStatus.PLANNING,
    priority: initialData?.priority || ProjectPriority.MEDIUM,
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
  };

  const schema = isEdit ? updateProjectSchema : createProjectSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(schema) as Resolver<CreateProjectInput>,
    defaultValues,
  });

  const onSubmit = async (data: CreateProjectInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = isEdit ? `/api/projects/${initialData.id}` : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || (isEdit ? "Failed to update project" : "Failed to create project"));
      } else {
        const projectId = result.project?.id || initialData?.id || "";
        onSuccess(projectId);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium leading-none" htmlFor="name">
            Project Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium leading-none" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium leading-none" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              disabled={isLoading}
            >
              {Object.values(ProjectStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium leading-none" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              {...register("priority")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              disabled={isLoading}
            >
              {Object.values(ProjectPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium leading-none" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              {...register("startDate")}
              defaultValue={formatInitialDate(initialData?.startDate)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              disabled={isLoading}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium leading-none" htmlFor="deadline">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              {...register("deadline")}
              defaultValue={formatInitialDate(initialData?.deadline)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              disabled={isLoading}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-destructive">{errors.deadline.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
            ? "Save Changes"
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
