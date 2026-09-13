import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { ProjectMemberService } from "@/services/project-member.service";
import { updateProjectMemberSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ projectId: string; memberId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const body = await req.json();

    const result = updateProjectMemberSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const member = await ProjectMemberService.updateRole(
      resolvedParams.projectId, 
      user.id, 
      user.name || "Unknown",
      resolvedParams.memberId, 
      result.data.role
    );
    return NextResponse.json({ member });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message.startsWith("Forbidden") || error.message.startsWith("Cannot")) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error.message.includes("not found")) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ projectId: string; memberId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    await ProjectMemberService.removeMember(resolvedParams.projectId, user.id, user.name || "Unknown", resolvedParams.memberId);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message.startsWith("Forbidden") || error.message.startsWith("Cannot")) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error.message.includes("not found")) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
