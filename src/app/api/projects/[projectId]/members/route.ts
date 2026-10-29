import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { ProjectMemberService } from "@/services/project-member.service";
import { addProjectMemberSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const members = await ProjectMemberService.getMembers(resolvedParams.projectId, user.id);
    return NextResponse.json({ members });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (error.message.startsWith("Forbidden")) return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const body = await req.json();

    const result = addProjectMemberSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const member = await ProjectMemberService.addMember(resolvedParams.projectId, user.id, user.name || "Unknown", result.data.email, result.data.role);
    return NextResponse.json({ member }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (error.message.startsWith("Forbidden") || error.message.startsWith("Cannot")) return NextResponse.json({ error: error.message }, { status: 403 });
      if (error.message.startsWith("Conflict")) return NextResponse.json({ error: error.message }, { status: 409 });
      if (error.message === "User not found") return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
