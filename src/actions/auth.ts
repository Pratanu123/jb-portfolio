"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export async function loginAction(_: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "The key does not fit this lock. Check the email and password.";
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
