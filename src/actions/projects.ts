"use server";

import { db } from "@/db";
import { projects, projectMembers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "Project name is required" };

  try {
    const [newProject] = await db.insert(projects).values({
      name,
      description,
      ownerId: session.user.id,
    }).returning();

    await db.insert(projectMembers).values({
      projectId: newProject.id,
      userId: session.user.id,
      role: "ADMIN",
    });

    revalidatePath("/dashboard");
    return { success: true, projectId: newProject.id };
  } catch (error) {
    return { error: "Failed to create project" };
  }
}

export async function addProjectMember(projectId: string, email: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Check if current user is Admin
  const [member] = await db.select()
    .from(projectMembers)
    .where(and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, session.user.id)
    ));

  if (!member || member.role !== "ADMIN") {
    return { error: "Only admins can add members" };
  }

  // Find user by email
  const [userToAdd] = await db.select().from(users).where(eq(users.email, email));
  if (!userToAdd) return { error: "User not found" };

  try {
    await db.insert(projectMembers).values({
      projectId,
      userId: userToAdd.id,
      role: "MEMBER",
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return { error: "User is already a member" };
  }
}

export async function getProjects() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userProjects = await db.select({
    id: projects.id,
    name: projects.name,
    description: projects.description,
    role: projectMembers.role,
  })
    .from(projects)
    .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
    .where(eq(projectMembers.userId, session.user.id));

  return userProjects;
}
