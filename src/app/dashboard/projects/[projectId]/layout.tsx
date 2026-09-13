import { requireAuth } from "@/lib/session";
import { ProjectService } from "@/services/project.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function ProjectLayout(
  { children, params }: { children: React.ReactNode, params: Promise<{ projectId: string }> }
) {
  const user = await requireAuth();
  const resolvedParams = await params;
  
  try {
    // Check if user has access. We only need the project metadata for the layout, 
    // but the service method handles access checking safely.
    const project = await ProjectService.getProjectDetails(resolvedParams.projectId, user.id);
    
    if (!project) {
      notFound();
    }
    
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full">
        <div className="sticky top-0 z-20 bg-background pt-6 px-8 pb-0 border-b mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
            <div className="flex items-center space-x-2">
              <StatusBadge status={project.status} />
            </div>
          </div>

          <nav className="-mb-px flex space-x-8">
            <Link 
              href={`/dashboard/projects/${project.id}`}
              className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Overview
            </Link>
            <Link 
              href={`/dashboard/projects/${project.id}/tasks`}
              className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Tasks
            </Link>
            <Link 
              href={`/dashboard/projects/${project.id}/members`}
              className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Members
            </Link>
            <Link 
              href={`/dashboard/projects/${project.id}/activity`}
              className="border-transparent text-muted-foreground hover:text-foreground hover:border-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Activity
            </Link>
          </nav>
        </div>
        
        <div className="px-8 pb-8 space-y-4">
          {children}
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.message.includes("Forbidden")) {
      return (
        <div className="p-8 text-center text-destructive">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p>You do not have permission to view this project.</p>
          <Link href="/dashboard/projects" className="text-primary hover:underline mt-4 inline-block">Back to Projects</Link>
        </div>
      );
    }
    notFound();
  }
}
