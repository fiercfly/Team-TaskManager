"use client";

import { useState } from "react";
import { updateTaskStatus } from "@/actions/tasks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function TaskStatusSelect({ taskId, projectId, initialStatus }: { taskId: string, projectId: string, initialStatus: string }) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(value: string | null) {
    if (!value) return;
    setLoading(true);
    const result = await updateTaskStatus(taskId, projectId, value);
    setLoading(false);

    if (result.success) {
      toast.success("Status updated!");
    } else {
      toast.error(result.error || "Update failed");
    }
  }

  return (
    <Select defaultValue={initialStatus} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger className="h-6 text-[9px] bg-white/5 border-white/10 w-24 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-white/10 text-white text-[10px]">
        <SelectItem value="TODO">To Do</SelectItem>
        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
        <SelectItem value="DONE">Done</SelectItem>
      </SelectContent>
    </Select>
  );
}
