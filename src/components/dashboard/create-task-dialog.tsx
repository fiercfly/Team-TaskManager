"use client";

import { useState } from "react";
import { createTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateTaskDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createTask(formData);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      toast.success("Task created successfully!");
    } else {
      toast.error(result.error || "Failed to create task");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-white text-black hover:bg-white/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      } />
      <DialogContent className="bg-zinc-950 border-white/10 text-white">
        <form action={handleSubmit}>
          <input type="hidden" name="projectId" value={projectId} />
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription className="text-white/50">
              Define what needs to be done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" name="title" placeholder="e.g. Design Login Screen" className="bg-white/5 border-white/10" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select name="priority" defaultValue="MEDIUM">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" className="bg-white/5 border-white/10" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-white text-black hover:bg-white/90 w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
