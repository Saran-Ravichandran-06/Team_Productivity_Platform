import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { TaskService } from "@/services/task.service";
import { updateTaskSchema } from "@/lib/validations";

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string, taskId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    
    const task = await TaskService.getTaskById(resolvedParams.projectId, resolvedParams.taskId, user.id);
    return NextResponse.json({ task });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message.startsWith("Forbidden")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.startsWith("Not Found")) return NextResponse.json({ error: message }, { status: 404 });
    
    console.error("GET /api/projects/[id]/tasks/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ projectId: string; taskId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const body = await req.json();

    const result = updateTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const task = await TaskService.updateTask(resolvedParams.projectId, user.id, user.name || "Unknown", resolvedParams.taskId, result.data);
    return NextResponse.json({ task });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message.startsWith("Forbidden")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.startsWith("Not Found")) return NextResponse.json({ error: message }, { status: 404 });
    if (message.startsWith("Bad Request")) return NextResponse.json({ error: message }, { status: 400 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ projectId: string, taskId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    
    await TaskService.deleteTask(resolvedParams.projectId, user.id, resolvedParams.taskId);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message.startsWith("Forbidden")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.startsWith("Not Found")) return NextResponse.json({ error: message }, { status: 404 });
    
    console.error("DELETE /api/projects/[id]/tasks/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
