"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <div className="flex-1 space-y-4 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Project</h2>
      </div>

      <div className="border rounded-xl p-6 bg-card mt-6">
        <ProjectForm
          onSuccess={(projectId) => {
            router.push(`/dashboard/projects/${projectId}`);
            router.refresh();
          }}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
