import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, projectMembers } from "@/db/schema";
import { count, eq, sql, and } from "drizzle-orm";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;
  
  const [totalTasksCount] = await db.select({ value: count() })
    .from(tasks)
    .innerJoin(projectMembers, eq(tasks.projectId, projectMembers.projectId))
    .where(eq(projectMembers.userId, userId));

  const [todoTasksCount] = await db.select({ value: count() })
    .from(tasks)
    .innerJoin(projectMembers, eq(tasks.projectId, projectMembers.projectId))
    .where(and(
      eq(projectMembers.userId, userId),
      eq(tasks.status, "TODO")
    ));

  const [inProgressTasksCount] = await db.select({ value: count() })
    .from(tasks)
    .innerJoin(projectMembers, eq(tasks.projectId, projectMembers.projectId))
    .where(and(
      eq(projectMembers.userId, userId),
      eq(tasks.status, "IN_PROGRESS")
    ));

  const [doneTasksCount] = await db.select({ value: count() })
    .from(tasks)
    .innerJoin(projectMembers, eq(tasks.projectId, projectMembers.projectId))
    .where(and(
      eq(projectMembers.userId, userId),
      eq(tasks.status, "DONE")
    ));
  
  const [overdueTasksCount] = await db.select({ value: count() })
    .from(tasks)
    .innerJoin(projectMembers, eq(tasks.projectId, projectMembers.projectId))
    .where(and(
      eq(projectMembers.userId, userId),
      sql`${tasks.status} != 'DONE' AND ${tasks.dueDate} < now()`
    ));

  const stats = [
    { label: "Total Tasks", value: totalTasksCount.value, icon: ListTodo, color: "text-blue-400" },
    { label: "In Progress", value: inProgressTasksCount.value, icon: Clock, color: "text-yellow-400" },
    { label: "Completed", value: doneTasksCount.value, icon: CheckCircle2, color: "text-green-400" },
    { label: "Overdue", value: overdueTasksCount.value, icon: AlertCircle, color: "text-red-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name}</h1>
        <p className="text-white/50">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white/[0.02] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/50">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/[0.02] border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Activity Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-white/20 border-t border-white/5 mt-4">
            <div className="text-center">
              <p className="text-sm italic">Analytics will appear here as your team completes tasks.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-white/70">No recent activity found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
