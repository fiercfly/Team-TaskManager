"use server";

import { db } from "@/db";
import { tasks, projectMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as any;
  const dueDateStr = formData.get("dueDate") as string;

  if (!title || !projectId) return { error: "Title and Project ID are required" };

  const [member] = await db.select()
    .from(projectMembers)
    .where(and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, session.user.id)
    ));

  if (!member) return { error: "Not a member of this project" };

  try {
    await db.insert(tasks).values({
      title,
      description,
      priority: priority || "MEDIUM",
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      projectId,
      status: "TODO",
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to create task" };
  }
}

export async function updateTaskStatus(taskId: string, projectId: string, status: any) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const [member] = await db.select()
    .from(projectMembers)
    .where(and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, session.user.id)
    ));

  if (!member) return { error: "Access denied" };

  try {
    await db.update(tasks)
      .set({ status, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return { error: "Update failed" };
  }
}
