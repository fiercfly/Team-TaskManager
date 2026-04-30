"use client";

import { useState } from "react";
import { addProjectMember } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InviteMemberForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    setLoading(true);
    const result = await addProjectMember(projectId, email);
    setLoading(false);

    if (result.success) {
      toast.success("Member invited!");
      (document.getElementById("invite-form") as HTMLFormElement).reset();
    } else {
      toast.error(result.error || "Failed to invite member");
    }
  }

  return (
    <form id="invite-form" action={handleSubmit} className="flex gap-2">
      <Input name="email" type="email" placeholder="team@example.com" className="bg-white/5 border-white/10 text-white" required />
      <Button type="submit" className="bg-white text-black hover:bg-white/90" disabled={loading}>
        {loading ? "Inviting..." : "Invite"}
      </Button>
    </form>
  );
}
