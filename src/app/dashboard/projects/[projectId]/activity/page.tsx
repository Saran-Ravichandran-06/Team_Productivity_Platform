import { requireAuth } from "@/lib/session";
import { ProjectService } from "@/services/project.service";
import { ActivityClient } from "./ActivityClient";

export default async function ProjectActivityPage({ params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAuth();
  const resolvedParams = await params;
  
  // Ensures the user has access
  await ProjectService.getProjectDetails(resolvedParams.projectId, user.id);

  return (
    <ActivityClient projectId={resolvedParams.projectId} />
  );
}
