import { requireAuth } from "@/lib/session";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MainNav } from "@/components/dashboard/main-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b px-6 py-4 flex justify-between items-center bg-card sticky top-0 z-40">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-4">
            <h1
              className="text-2xl font-bold tracking-tighter text-primary font-brand italic"
              style={{
                fontFamily: "'Times New Roman MT', 'Times New Roman', Times, serif",
                fontStyle: "italic",
              }}
            >
              KNOVA
            </h1>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationBell />
          <span className="text-sm font-medium text-muted-foreground hidden lg:inline-block border-l pl-4 ml-2">
            {user.email}
          </span>
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Logout
            </Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
