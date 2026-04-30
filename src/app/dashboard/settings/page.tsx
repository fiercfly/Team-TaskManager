import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-white/50">Manage your account and preferences.</p>
      </div>

      <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/40 mb-1">Name</label>
            <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60">
              {session.user?.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/40 mb-1">Email</label>
            <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60">
              {session.user?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-2">Account Status</h2>
        <p className="text-white/50 text-sm">You are currently logged in as {session.user?.name}. Account deletion and other features are coming soon.</p>
      </div>
    </div>
  );
}
