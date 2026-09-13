import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { ActivityService } from "@/services/activity.service";

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");

    const result = await ActivityService.getProjectActivity(
      resolvedParams.projectId, 
      user.id, 
      page, 
      pageSize
    );

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message.startsWith("Forbidden")) return NextResponse.json({ error: error.message }, { status: 403 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
