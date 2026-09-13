import { requireAuth } from "@/lib/session";
import { ProjectService } from "@/services/project.service";
import { getProjectMembership, canEditProject, canManageProject } from "@/lib/permissions";
import ProjectActions from "./ProjectActions";

export default async function ProjectOverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAuth();
  const resolvedParams = await params;
  const project = await ProjectService.getProjectDetails(resolvedParams.projectId, user.id);
  
  if (!project) {
    throw new Error("Project not found");
  }

  const membership = await getProjectMembership(user.id, project.id);
  
  if (!membership) {
    throw new Error("Forbidden");
  }

  const canEdit = canEditProject(membership.role);
  const canDelete = canManageProject(membership.role);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Project Details</h3>
        <ProjectActions projectId={project.id} canEdit={canEdit} canDelete={canDelete} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl p-6 bg-card space-y-4 shadow-sm">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
            <p className="mt-1">{project.description || "No description provided."}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p className="mt-1 capitalize">{project.status.toLowerCase()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Priority</h4>
              <p className="mt-1 capitalize">{project.priority.toLowerCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
              <p className="mt-1">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Deadline</h4>
              <p className="mt-1">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-card space-y-4 shadow-sm">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
            <p className="mt-1">{project.owner.name} ({project.owner.email})</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Members</h4>
            <p className="mt-1">{project._count.members} total members</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Tasks</h4>
            <p className="mt-1">{project._count.tasks} total tasks</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
            <p className="mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
