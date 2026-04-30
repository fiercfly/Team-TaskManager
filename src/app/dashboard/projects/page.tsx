import { getProjects } from "@/actions/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";

export default async function ProjectsPage() {
  const projectsList = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-white/50 text-lg">Manage your teams and task flows.</p>
        </div>
        
        <CreateProjectDialog />
      </div>

      {projectsList.length === 0 ? (
        <Card className="bg-white/[0.02] border-dashed border-white/10 py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">No projects yet</p>
              <p className="text-white/40 text-sm">Create your first project to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsList.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-colors h-full group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      {project.role === "ADMIN" ? (
                        <><ShieldCheck className="w-3 h-3 text-purple-400" /> Admin</>
                      ) : (
                        <><User className="w-3 h-3 text-blue-400" /> Member</>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-white transition-colors">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-white/40">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Active
                    </span>
                    <span>•</span>
                    <span>0 Tasks</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
