"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  LogOut, 
  PlusCircle,
  Hash
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FolderKanban, label: "Projects", href: "/dashboard/projects" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar({ projects }: { projects: any[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <LayoutDashboard className="text-black w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">TeamTask</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href 
                ? "bg-white/10 text-white" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Projects</h4>
            <Button variant="ghost" size="icon" className="h-4 w-4 text-white/40 hover:text-white">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/dashboard/projects/${project.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors group",
                  pathname === `/dashboard/projects/${project.id}`
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Hash className={cn(
                  "w-3 h-3 transition-colors",
                  pathname === `/dashboard/projects/${project.id}` ? "text-white" : "text-white/20 group-hover:text-white/50"
                )} />
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/50 hover:text-red-400 hover:bg-red-400/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
