import { requireAuth } from "@/lib/session";
import { ProjectService } from "@/services/project.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectFilters } from "@/components/projects/project-filters";
import { FolderKanban } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await requireAuth();
  const resolvedSearchParams = await searchParams;
  
  const filters = {
    status: resolvedSearchParams.status,
    priority: resolvedSearchParams.priority,
    search: resolvedSearchParams.search,
  };

  const projects = await ProjectService.getProjects(user.id, filters);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>
      </div>

      <ProjectFilters />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card border-dashed mt-8">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-2 mb-4">You are not a member of any projects yet.</p>
          <Link href="/dashboard/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <div className="border rounded-xl p-6 bg-card shadow-sm hover:shadow-md transition h-full flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">{project.description}</p>
                )}
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Priority:</span>
                    <PriorityBadge priority={project.priority} />
                  </div>
                  <span>{project._count.members} Member{project._count.members !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
