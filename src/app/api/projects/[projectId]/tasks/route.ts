import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { TaskService } from "@/services/task.service";
import { createTaskSchema, taskQuerySchema } from "@/lib/validations";

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    
    const { searchParams } = new URL(req.url);
    const query = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      assigneeId: searchParams.get("assigneeId") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      pageSize: searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!) : undefined,
      sort: searchParams.get("sort") || undefined,
      sortDir: searchParams.get("sortDir") || undefined,
    };

    const parsedQuery = taskQuerySchema.parse(query);

    const result = await TaskService.listTasks(resolvedParams.projectId, user.id, parsedQuery);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message.startsWith("Forbidden")) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error.name === "ZodError") return NextResponse.json({ error: "Invalid query parameters", details: error.format() }, { status: 400 });
    
    console.error("GET /api/projects/[id]/tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const body = await req.json();

    const result = createTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const task = await TaskService.createTask(resolvedParams.projectId, user.id, user.name || "Unknown", result.data);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message.startsWith("Forbidden")) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error.message.startsWith("Bad Request")) return NextResponse.json({ error: error.message }, { status: 400 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
