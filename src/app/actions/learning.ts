"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { currentUser, requireUser } from "@/lib/auth";
import { getModule, getLesson } from "@/lib/content";
import { markLessonComplete, markLessonIncomplete, saveQuizResult, setNewcomerTrack } from "@/lib/repo";

export async function toggleLessonAction(form: FormData) {
  const moduleSlug = String(form.get("module"));
  const lessonSlug = String(form.get("lesson"));
  const user = await requireUser(`/course/${moduleSlug}/${lessonSlug}`);
  if (!getLesson(moduleSlug, lessonSlug)) return;
  if (form.get("complete") === "1") markLessonComplete(getDb(), user.id, moduleSlug, lessonSlug);
  else markLessonIncomplete(getDb(), user.id, moduleSlug, lessonSlug);
  revalidatePath("/", "layout");
}

export type QuizState = { correct: number; total: number; results: boolean[]; saved: boolean } | undefined;

export async function submitQuizAction(_: QuizState, form: FormData): Promise<QuizState> {
  const moduleSlug = String(form.get("module"));
  const mod = getModule(moduleSlug);
  if (!mod) return undefined;
  const answers = mod.quiz.map((q) => {
    const v = form.get(q.id);
    return v === null ? -1 : Number(v);
  });
  const results = mod.quiz.map((q, i) => answers[i] === q.answer);
  const correct = results.filter(Boolean).length;
  const user = await currentUser();
  if (user) {
    saveQuizResult(getDb(), user.id, moduleSlug, answers, correct, mod.quiz.length);
    revalidatePath("/dashboard");
  }
  return { correct, total: mod.quiz.length, results, saved: Boolean(user) };
}

export async function setNewcomerTrackAction(form: FormData) {
  const user = await requireUser("/dashboard");
  setNewcomerTrack(getDb(), user.id, form.get("on") === "1");
  revalidatePath("/", "layout");
}
