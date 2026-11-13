import fs from "node:fs";
import path from "node:path";

export type Access = "FREE" | "PAID";
export type Reading = { title: string; source: string; url: string; access: Access; note: string };
export type Video = { url: string | null; presenter: string | null };
export type Lesson = { slug: string; title: string; minutes: number; body: string; video: Video };
export type QuizQuestion = { id: string; question: string; options: string[]; answer: number; explanation: string };
export type CourseModule = {
  number: number;
  slug: string;
  title: string;
  phase: string;
  summary: string;
  freePreview: boolean;
  reviewNotice: boolean;
  outcomes: string[];
  video: Video;
  lessons: Lesson[];
  readings: Reading[];
  practicalOutput: { title: string; description: string; steps: string[] };
  quiz: QuizQuestion[];
  relatedTool: { slug: string; label: string; status: "working" | "planned" };
  newcomerSupplements: string[];
};

export const REVIEW_NOTICE = "Educational only, not advice. Pending professional review.";

const CONTENT_DIR = path.join(process.cwd(), "content");

let cache: CourseModule[] | null = null;

/** All modules, sorted 0..11. Content lives in content/modules/*.json. */
export function getModules(): CourseModule[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const dir = path.join(CONTENT_DIR, "modules");
  const mods = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as CourseModule)
    .sort((a, b) => a.number - b.number);
  cache = mods;
  return mods;
}

export function getModule(slug: string) {
  return getModules().find((m) => m.slug === slug) ?? null;
}

export function getLesson(moduleSlug: string, lessonSlug: string) {
  const m = getModule(moduleSlug);
  const lesson = m?.lessons.find((l) => l.slug === lessonSlug);
  return m && lesson ? { module: m, lesson } : null;
}

/** Flat ordered list of every lesson, used for next/previous and "continue". */
export function allLessons() {
  return getModules().flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l, key: `${m.slug}/${l.slug}` })));
}

export function nextLesson(completed: Set<string>) {
  return allLessons().find((x) => !completed.has(x.key)) ?? null;
}

export function moduleProgress(m: CourseModule, completed: Set<string>) {
  const done = m.lessons.filter((l) => completed.has(`${m.slug}/${l.slug}`)).length;
  return { done, total: m.lessons.length };
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")) as T;
}

export type Role = {
  slug: string;
  title: string;
  newcomerOnly?: boolean;
  summary: string;
  does: string[];
  doesNot: string[];
  whenYouNeed: string[];
  questions: string[];
  links: { title: string; url: string }[];
};
export const getRoles = () => readJson<Role[]>("deal-team.json");

export type Supplement = {
  code: string;
  slug: string;
  title: string;
  summary: string;
  reviewNotice: boolean;
  body: string;
  modules: string[];
  links: { title: string; url: string; source: string }[];
};
export const getSupplements = () => readJson<Supplement[]>("newcomers.json");
export const getSupplement = (slug: string) => getSupplements().find((s) => s.slug === slug) ?? null;

export type ChecklistGroup = { title: string; items: { key: string; label: string; module?: string }[] };
export const getChecklist = () => readJson<ChecklistGroup[]>("checklist.json");

export type ToolInfo = { slug: string; title: string; summary: string; status: "working" | "planned"; href?: string };
export const getTools = () => readJson<ToolInfo[]>("tools.json");
