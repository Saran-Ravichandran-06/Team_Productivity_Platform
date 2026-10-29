import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { ProjectService } from "@/services/project.service";
import { updateProjectSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const project = await ProjectService.getProjectDetails(resolvedParams.projectId, user.id);
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (error.message.startsWith("Forbidden")) return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const body = await req.json();

    const result = updateProjectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const project = await ProjectService.updateProject(resolvedParams.projectId, user.id, user.name || "Unknown", result.data);
    return NextResponse.json({ project });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (error.message.startsWith("Forbidden")) return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    await ProjectService.deleteProject(resolvedParams.projectId, user.id);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (error.message.startsWith("Forbidden")) return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
