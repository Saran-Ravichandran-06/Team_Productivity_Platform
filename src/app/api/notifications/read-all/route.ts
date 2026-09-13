import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { NotificationService } from "@/services/notification.service";

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    
    await NotificationService.markAllAsRead(user.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
