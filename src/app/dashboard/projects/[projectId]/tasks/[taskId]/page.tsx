import { requireAuth } from "@/lib/session";
import { TaskService } from "@/services/task.service";
import { getProjectMembership, canUpdateTask, canDeleteTask } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { TaskDetailClient } from "./TaskDetailClient";
import { notFound } from "next/navigation";

export default async function TaskDetailPage({ 
  params 
}: { 
  params: Promise<{ projectId: string, taskId: string }> 
}) {
  const user = await requireAuth();
  const resolvedParams = await params;

  try {
    const task = await TaskService.getTaskById(resolvedParams.projectId, resolvedParams.taskId, user.id);
    const membership = await getProjectMembership(user.id, resolvedParams.projectId);
    
    if (!membership) {
      notFound();
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId: resolvedParams.projectId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } }
      }
    });

    const canEdit = canUpdateTask(membership.role, user.id, task.creatorId, task.assigneeId);
    const canDelete = canDeleteTask(membership.role, user.id, task.creatorId);

    return (
      <TaskDetailClient 
        projectId={resolvedParams.projectId} 
        task={task} 
        members={members} 
        canEdit={canEdit} 
        canDelete={canDelete}
        currentUserRole={membership.role}
        currentUserId={user.id}
      />
    );
  } catch (error: any) {
    if (error.message.includes("Forbidden") || error.message.includes("Not Found")) {
      notFound();
    }
    throw error;
  }
}
