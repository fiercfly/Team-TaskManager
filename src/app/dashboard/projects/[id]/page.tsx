import { db } from "@/db";
import { projects, tasks, projectMembers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Layout, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskStatusSelect } from "@/components/dashboard/task-status-select";
import { InviteMemberForm } from "@/components/dashboard/invite-member-form";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id: projectId } = await params;

  const [member] = await db.select()
    .from(projectMembers)
    .where(and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, session!.user!.id!)
    ));

  if (!member) redirect("/dashboard/projects");

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
  const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, projectId));
  const members = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: projectMembers.role,
  })
    .from(projectMembers)
    .innerJoin(users, eq(projectMembers.userId, users.id))
    .where(eq(projectMembers.projectId, projectId));

  const isAdmin = member.role === "ADMIN";

  const statusColumns = [
    { label: "To Do", value: "TODO", icon: Layout, color: "bg-zinc-800" },
    { label: "In Progress", value: "IN_PROGRESS", icon: Clock, color: "bg-blue-500/10 text-blue-400" },
    { label: "Done", value: "DONE", icon: CheckCircle2, color: "bg-green-500/10 text-green-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">{project.name}</h1>
            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/50">
              {isAdmin ? "Admin View" : "Member View"}
            </Badge>
          </div>
          <p className="text-white/50 text-lg max-w-2xl">{project.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger render={
              <Button variant="outline" className="border-white/10 text-white/70 hover:text-white hover:bg-white/5">
                <Users className="w-4 h-4 mr-2" />
                Team ({members.length})
              </Button>
            } />
            <DialogContent className="bg-zinc-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Project Team</DialogTitle>
                <DialogDescription className="text-white/50">
                  Manage who has access to this project.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {isAdmin && <InviteMemberForm projectId={projectId} />}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <div>
                        <p className="font-medium text-sm">{m.name}</p>
                        <p className="text-xs text-white/40">{m.email}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {m.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <CreateTaskDialog projectId={projectId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map((col) => {
          const colTasks = projectTasks.filter(t => t.status === col.value);
          return (
            <div key={col.value} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <col.icon className={`w-4 h-4 ${col.color}`} />
                  <h3 className="font-semibold text-white/70">{col.label}</h3>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
              </div>

              <div className="space-y-3 min-h-[500px]">
                {colTasks.length === 0 ? (
                  <div className="border border-dashed border-white/5 rounded-xl h-24 flex items-center justify-center text-white/10 text-xs italic">
                    No tasks yet
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <Card key={task.id} className="bg-white/[0.03] border-white/5 hover:border-white/10 transition-all">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-semibold">{task.title}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] px-1.5 py-0 border-none uppercase font-black ${
                              task.priority === 'HIGH' ? 'text-red-400 bg-red-400/10' : 
                              task.priority === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10' : 
                              'text-blue-400 bg-blue-400/10'
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-4">
                        <p className="text-xs text-white/40 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between text-[10px] text-white/20">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                          </div>
                          
                          <TaskStatusSelect 
                            taskId={task.id} 
                            projectId={projectId} 
                            initialStatus={task.status} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
