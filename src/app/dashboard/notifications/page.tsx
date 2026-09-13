import { requireAuth } from "@/lib/session";
import { NotificationsClient } from "./NotificationsClient";

export default async function NotificationsPage() {
  await requireAuth();

  return (
    <div className="flex-1 p-8 pt-6 max-w-7xl mx-auto w-full">
      <NotificationsClient />
    </div>
  );
}
