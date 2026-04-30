import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/projects";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const projects = await getProjects();

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar projects={projects} />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black to-zinc-950">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
