import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { CommentService } from "@/services/comment.service";
import { updateCommentSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ projectId: string, taskId: string, commentId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const body = await req.json();

    const result = updateCommentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const comment = await CommentService.updateComment(
      resolvedParams.projectId, 
      resolvedParams.taskId,
      resolvedParams.commentId,
      user.id,
      result.data
    );

    return NextResponse.json({ comment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message.startsWith("Forbidden")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.startsWith("Not Found")) return NextResponse.json({ error: message }, { status: 404 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ projectId: string, taskId: string, commentId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;

    await CommentService.deleteComment(
      resolvedParams.projectId, 
      resolvedParams.taskId,
      resolvedParams.commentId,
      user.id
    );

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message.startsWith("Forbidden")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.startsWith("Not Found")) return NextResponse.json({ error: message }, { status: 404 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
