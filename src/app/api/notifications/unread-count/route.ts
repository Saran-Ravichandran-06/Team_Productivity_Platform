import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { NotificationService } from "@/services/notification.service";

export async function GET() {
  try {
    const user = await requireAuth();
    const count = await NotificationService.getUnreadCount(user.id);
    
    return NextResponse.json({ count });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
