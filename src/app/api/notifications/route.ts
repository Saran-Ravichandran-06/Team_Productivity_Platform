import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { NotificationService } from "@/services/notification.service";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
    const unreadOnly = url.searchParams.get("unread") === "true";

    const result = await NotificationService.getUserNotifications(user.id, page, pageSize, unreadOnly);
    
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
