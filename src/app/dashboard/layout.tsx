import { requireAuth } from "@/lib/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <DashboardShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </DashboardShell>
  );
}

