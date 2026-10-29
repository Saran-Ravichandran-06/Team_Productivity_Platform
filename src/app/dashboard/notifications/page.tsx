import { requireAuth } from "@/lib/session";
import { NotificationsClient } from "./NotificationsClient";

export default async function NotificationsPage() {
  await requireAuth();

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
      <NotificationsClient />
    </div>
  );
}
