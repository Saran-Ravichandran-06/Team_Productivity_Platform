import { requireAuth } from "@/lib/session";
import { TaskService } from "@/services/task.service";
import { taskQuerySchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { TaskHubClient } from "./TaskHubClient";
import { notFound } from "next/navigation";

export default async function TasksPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireAuth();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Build query
  const query = {
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined,
    status: typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
    priority: typeof resolvedSearchParams.priority === "string" ? resolvedSearchParams.priority : undefined,
    assigneeId: typeof resolvedSearchParams.assigneeId === "string" ? resolvedSearchParams.assigneeId : undefined,
    page: typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : undefined,
  };

  const parsedQuery = taskQuerySchema.parse(query);

  try {
    const { data: tasks, pagination } = await TaskService.listTasks(resolvedParams.projectId, user.id, parsedQuery);
    
    // We also need project members for the assignee dropdowns
    const members = await prisma.projectMember.findMany({
      where: { projectId: resolvedParams.projectId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } }
      }
    });

    return (
      <TaskHubClient 
        projectId={resolvedParams.projectId} 
        initialTasks={tasks} 
        pagination={pagination} 
        members={members} 
      />
    );
  } catch (error: any) {
    if (error.message.includes("Forbidden") || error.message.includes("Not Found")) {
      notFound();
    }
    throw error;
  }
}
