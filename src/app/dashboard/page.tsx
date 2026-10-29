import { requireAuth } from "@/lib/session";
import { DashboardAnalyticsClient } from "@/components/dashboard/dashboard-analytics-client";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
      <DashboardAnalyticsClient userName={user.name || "User"} />
    </main>
  );
}
