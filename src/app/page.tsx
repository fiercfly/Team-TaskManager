import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LayoutDashboard, Users2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-black w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">TeamTask</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white/70 hover:text-white">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-white text-black hover:bg-white/90">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            New: Project Dashboards & Analytics
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Manage your team <br />
            <span className="text-white/50">with precision.</span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-xl mx-auto">
            A minimalist task management tool designed for teams that value speed and clarity. Built for the modern workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 text-lg px-8 h-14">
                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 text-lg px-8 h-14">
                Live Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            {[
              { icon: <CheckCircle2 className="w-5 h-5" />, title: "Task Tracking", desc: "Keep everyone in sync with real-time status updates." },
              { icon: <Users2 className="w-5 h-5" />, title: "Team Roles", desc: "Admin and Member roles for secure project management." },
              { icon: <LayoutDashboard className="w-5 h-5" />, title: "Live Insights", desc: "Visualize progress with our beautiful analytics dashboard." }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 py-12 border-t border-white/5 text-center text-white/30 text-sm">
        &copy; 2026 TeamTask Inc. Built for performance.
      </footer>
    </div>
  );
}
