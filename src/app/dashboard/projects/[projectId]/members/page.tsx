import { requireAuth } from "@/lib/session";
import { ProjectMemberService } from "@/services/project-member.service";
import { getProjectMembership, canManageMembers } from "@/lib/permissions";
import ProjectMembersClient from "./ProjectMembersClient";
import { ProjectRole } from "@prisma/client";

export default async function ProjectMembersPage({ params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAuth();
  const resolvedParams = await params;
  
  // Ensure the user has access and fetch their membership
  const membership = await getProjectMembership(user.id, resolvedParams.projectId);
  if (!membership) {
    throw new Error("Forbidden");
  }

  const members = await ProjectMemberService.getMembers(resolvedParams.projectId, user.id);
  const canManage = canManageMembers(membership.role);

  // We map members to match the expected type
  const initialMembers = members.map(m => ({
    id: m.id,
    role: m.role as ProjectRole,
    joinedAt: m.joinedAt.toISOString(),
    user: {
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
    }
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Members</h3>
      
      <ProjectMembersClient 
        projectId={resolvedParams.projectId} 
        initialMembers={initialMembers} 
        canManage={canManage} 
      />
    </div>
  );
}
