"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema, UpdateProjectInput } from "@/lib/validations";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectStatus, ProjectPriority } from "@prisma/client";
import Link from "next/link";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema) as any,
  });

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to load project");
        }
        const data = await response.json();
        const project = data.project;
        
        // Format dates for the input[type=date] if they exist
        const startDate = project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : null;
        const deadline = project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : null;

        reset({
          name: project.name,
          description: project.description,
          status: project.status,
          priority: project.priority,
          startDate: (startDate || undefined) as any,
          deadline: (deadline || undefined) as any,
        });
      } catch (err) {
        setError("Failed to load project data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProject();
  }, [projectId, reset]);

  const onSubmit = async (data: UpdateProjectInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to update project");
      } else {
        router.push(`/dashboard/projects/${projectId}`);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 max-w-3xl w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
      </div>

      <div className="border rounded-xl p-6 bg-card mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="name">Project Name <span className="text-destructive">*</span></label>
              <input 
                id="name" 
                type="text" 
                {...register("name")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium leading-none" htmlFor="description">Description</label>
              <textarea 
                id="description" 
                {...register("description")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                disabled={isLoading}
              />
              {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium leading-none" htmlFor="status">Status</label>
                <select 
                  id="status" 
                  {...register("status")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  disabled={isLoading}
                >
                  {Object.values(ProjectStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {errors.status && <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium leading-none" htmlFor="priority">Priority</label>
                <select 
                  id="priority" 
                  {...register("priority")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  disabled={isLoading}
                >
                  {Object.values(ProjectPriority).map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
                {errors.priority && <p className="mt-1 text-sm text-destructive">{errors.priority.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium leading-none" htmlFor="startDate">Start Date</label>
                <input 
                  id="startDate" 
                  type="date" 
                  {...register("startDate")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  disabled={isLoading}
                />
                {errors.startDate && <p className="mt-1 text-sm text-destructive">{errors.startDate.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium leading-none" htmlFor="deadline">Deadline</label>
                <input 
                  id="deadline" 
                  type="date" 
                  {...register("deadline")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  disabled={isLoading}
                />
                {errors.deadline && <p className="mt-1 text-sm text-destructive">{errors.deadline.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Link href={`/dashboard/projects/${projectId}`}>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
