import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { NotificationService } from "@/services/notification.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ notificationId: string }> }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    
    const body = await req.json();
    if (body.read === true) {
      await NotificationService.markAsRead(user.id, resolvedParams.notificationId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
