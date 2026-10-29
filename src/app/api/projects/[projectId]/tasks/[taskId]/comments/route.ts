import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { CommentService } from "@/services/comment.service";
import { createCommentSchema } from "@/lib/validations";

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string, taskId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;

    const comments = await CommentService.getComments(
      resolvedParams.projectId, 
      resolvedParams.taskId,
      user.id
    );

    return NextResponse.json({ comments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message.startsWith("Forbidden")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.startsWith("Not Found")) return NextResponse.json({ error: message }, { status: 404 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string, taskId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const body = await req.json();

    const result = createCommentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const comment = await CommentService.createComment(
      resolvedParams.projectId, 
      resolvedParams.taskId,
      user.id,
      user.name || "Unknown",
      result.data
    );

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message.startsWith("Forbidden")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.startsWith("Not Found")) return NextResponse.json({ error: message }, { status: 404 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
