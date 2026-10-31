import { requireAuth } from "@/lib/session";
import { ProjectService } from "@/services/project.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProjectNavTabs } from "@/components/projects/project-nav-tabs";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuth();
  const resolvedParams = await params;

  let project: Awaited<ReturnType<typeof ProjectService.getProjectDetails>> | null = null;
  let isForbidden = false;

  try {
    project = await ProjectService.getProjectDetails(
      resolvedParams.projectId,
      user.id
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Forbidden")) {
      isForbidden = true;
    } else {
      notFound();
    }
  }

  if (isForbidden) {
    return (
      <div className="p-8 text-center text-destructive">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2">You do not have permission to view this project.</p>
        <Link
          href="/dashboard/projects"
          className="text-primary hover:underline mt-4 inline-block font-medium"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full">
      {/* Project Header and Secondary Navigation */}
      <div className="sticky top-[72px] z-10 bg-background/95 backdrop-blur-xs pt-4 px-4 sm:px-6 lg:px-8 pb-0 border-b border-border mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {project.name}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Project-specific secondary navigation tabs */}
        <ProjectNavTabs projectId={project.id} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-6">
        {children}
      </div>
    </div>
  );
}
