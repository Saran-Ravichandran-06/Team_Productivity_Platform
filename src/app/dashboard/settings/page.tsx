import { requireAuth } from "@/lib/session";

export default async function SettingsPage() {
  const user = await requireAuth();

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-4xl mx-auto w-full space-y-6">
      <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Profile Information</h3>
          <div className="grid gap-4 max-w-sm">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="mt-1 font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Account modification (password reset, email changes) is disabled for this assignment phase.
          </p>
        </div>
      </div>
    </main>
  );
}
