"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { authenticate, createUser } from "@/lib/repo";
import { endSession, startSession } from "@/lib/auth";

export type FormState = { error?: string; ok?: string } | undefined;

const safeNext = (n: FormDataEntryValue | null) => {
  const s = typeof n === "string" ? n : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/dashboard";
};

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  password: z.string().min(10, "Use at least 10 characters for your password.").max(200),
});

export async function signUpAction(_: FormState, form: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse({ name: form.get("name"), email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  let id: number;
  try {
    id = await createUser(getDb(), parsed.data);
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_TAKEN") return { error: "An account with that email already exists. Try signing in." };
    throw e;
  }
  await startSession(id);
  redirect(safeNext(form.get("next")));
}

export async function signInAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const id = await authenticate(getDb(), email, password);
  if (!id) return { error: "That email and password don't match an account." };
  await startSession(id);
  redirect(safeNext(form.get("next")));
}

export async function signOutAction() {
  await endSession();
  redirect("/");
}
