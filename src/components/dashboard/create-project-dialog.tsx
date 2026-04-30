"use client";

import { useState } from "react";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createProject(formData);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      toast.success("Project created successfully!");
    } else {
      toast.error(result.error || "Failed to create project");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-white text-black hover:bg-white/90">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      } />
      <DialogContent className="bg-zinc-950 border-white/10 text-white">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription className="text-white/50">
              Add a new project to start managing tasks with your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" placeholder="e.g. Website Redesign" className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="What is this project about?" className="bg-white/5 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-white text-black hover:bg-white/90 w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
