import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { NotificationService } from "@/services/notification.service";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const count = await NotificationService.getUnreadCount(user.id);
    
    return NextResponse.json({ count });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
