import { requireAuth } from "@/lib/session";
import { AnalyticsService } from "@/services/analytics.service";
import { DashboardRange } from "@/types/analytics";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RangeSchema = z.enum(["7d", "30d", "6m", "1y"]).default("30d");

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    
    const url = new URL(req.url);
    const rangeParam = url.searchParams.get("range") || "30d";
    
    // Validate range
    const parsedRange = RangeSchema.safeParse(rangeParam);
    if (!parsedRange.success) {
      return NextResponse.json(
        { error: "Invalid range parameter. Allowed values are '7d', '30d', '6m', '1y'." },
        { status: 400 }
      );
    }
    
    const analytics = await AnalyticsService.getDashboardAnalytics(user.id, parsedRange.data as DashboardRange);
    
    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error("Failed to fetch dashboard analytics", error);
    
    if (error.message.includes("Unauthorized") || error.message.includes("Session not found")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
