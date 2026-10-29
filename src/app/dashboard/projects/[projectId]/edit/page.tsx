"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProjectForm, ProjectFormData } from "@/components/projects/project-form";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;

  const [project, setProject] = useState<ProjectFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to load project");
        }
        const data = await response.json();
        setProject(data.project);
      } catch {
        setError("Failed to load project data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (isFetching) {
    return <div className="py-6 text-sm text-muted-foreground">Loading project details...</div>;
  }

  if (error || !project) {
    return (
      <div className="py-6 text-sm text-destructive">
        {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 max-w-3xl w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
      </div>

      <div className="border rounded-xl p-6 bg-card mt-6">
        <ProjectForm
          initialData={project}
          onSuccess={() => {
            router.push(`/dashboard/projects/${projectId}`);
            router.refresh();
          }}
          onCancel={() => router.push(`/dashboard/projects/${projectId}`)}
        />
      </div>
    </div>
  );
}
