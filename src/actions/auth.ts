"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUp(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = signupSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: "Invalid form data. Please check your inputs." };
    }

    const { name, email, password } = validatedData.data;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function login(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    await signIn("credentials", {
      ...data,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}
