/**
 * Data access. Every function that touches user data takes the userId first
 * and filters on it, so one user can never read or change another user's rows.
 */
import { and, desc, eq } from "drizzle-orm";
import type { DB } from "./db";
import { checklistItems, lessonProgress, newsPrefs, newsReads, quizResults, scenarios, teamMembers, users } from "./schema";
import { hashPassword, verifyPassword } from "./password";
import type { CalculatorInputs } from "./calculator";

export const TEAM_STATUSES = ["not_contacted", "talking", "engaged"] as const;
export type TeamStatus = (typeof TEAM_STATUSES)[number];

const now = () => Date.now();
const normEmail = (e: string) => e.trim().toLowerCase();

// ---------- users ----------
export async function createUser(db: DB, input: { email: string; name: string; password: string }) {
  const email = normEmail(input.email);
  const existing = db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();
  if (existing) throw new Error("EMAIL_TAKEN");
  const passwordHash = await hashPassword(input.password);
  const row = db
    .insert(users)
    .values({ email, name: input.name.trim(), passwordHash, createdAt: now() })
    .returning({ id: users.id })
    .get();
  return row.id;
}

export async function authenticate(db: DB, email: string, password: string) {
  const user = db.select().from(users).where(eq(users.email, normEmail(email))).get();
  if (!user) return null;
  return (await verifyPassword(password, user.passwordHash)) ? user.id : null;
}

export function getUser(db: DB, userId: number) {
  const u = db.select().from(users).where(eq(users.id, userId)).get();
  if (!u) return null;
  return { id: u.id, email: u.email, name: u.name, newcomerTrack: u.newcomerTrack, lastModule: u.lastModule, lastLesson: u.lastLesson, createdAt: u.createdAt };
}

export function setNewcomerTrack(db: DB, userId: number, on: boolean) {
  db.update(users).set({ newcomerTrack: on }).where(eq(users.id, userId)).run();
}

export function setLastLesson(db: DB, userId: number, moduleSlug: string, lessonSlug: string) {
  db.update(users).set({ lastModule: moduleSlug, lastLesson: lessonSlug }).where(eq(users.id, userId)).run();
}

// ---------- lesson progress ----------
export function markLessonComplete(db: DB, userId: number, moduleSlug: string, lessonSlug: string) {
  db.insert(lessonProgress)
    .values({ userId, moduleSlug, lessonSlug, completedAt: now() })
    .onConflictDoNothing()
    .run();
}

export function markLessonIncomplete(db: DB, userId: number, moduleSlug: string, lessonSlug: string) {
  db.delete(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.moduleSlug, moduleSlug), eq(lessonProgress.lessonSlug, lessonSlug)))
    .run();
}

/** Set of "module/lesson" keys the user has completed. */
export function getCompletedLessons(db: DB, userId: number): Set<string> {
  const rows = db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId)).all();
  return new Set(rows.map((r) => `${r.moduleSlug}/${r.lessonSlug}`));
}

// ---------- quizzes ----------
export function saveQuizResult(db: DB, userId: number, moduleSlug: string, answers: number[], correct: number, total: number) {
  db.insert(quizResults)
    .values({ userId, moduleSlug, correct, total, answers: JSON.stringify(answers), takenAt: now() })
    .onConflictDoUpdate({
      target: [quizResults.userId, quizResults.moduleSlug],
      set: { correct, total, answers: JSON.stringify(answers), takenAt: now() },
    })
    .run();
}

export function getQuizResults(db: DB, userId: number) {
  const rows = db.select().from(quizResults).where(eq(quizResults.userId, userId)).all();
  return new Map(rows.map((r) => [r.moduleSlug, { correct: r.correct, total: r.total, answers: JSON.parse(r.answers) as number[], takenAt: r.takenAt }]));
}

// ---------- deal team ----------
export type TeamMemberInput = { name: string; firm: string; role: string; status: TeamStatus; notes: string };

export function listTeam(db: DB, userId: number) {
  return db.select().from(teamMembers).where(eq(teamMembers.userId, userId)).orderBy(teamMembers.createdAt).all();
}

export function addTeamMember(db: DB, userId: number, m: TeamMemberInput) {
  return db.insert(teamMembers).values({ ...m, userId, createdAt: now(), updatedAt: now() }).returning({ id: teamMembers.id }).get().id;
}

/** Returns true only if the row belongs to this user and was updated. */
export function updateTeamMember(db: DB, userId: number, id: number, m: TeamMemberInput) {
  const res = db
    .update(teamMembers)
    .set({ ...m, updatedAt: now() })
    .where(and(eq(teamMembers.id, id), eq(teamMembers.userId, userId)))
    .run();
  return res.changes > 0;
}

export function deleteTeamMember(db: DB, userId: number, id: number) {
  const res = db.delete(teamMembers).where(and(eq(teamMembers.id, id), eq(teamMembers.userId, userId))).run();
  return res.changes > 0;
}

// ---------- calculator scenarios ----------
export function listScenarios(db: DB, userId: number) {
  return db
    .select()
    .from(scenarios)
    .where(eq(scenarios.userId, userId))
    .orderBy(desc(scenarios.createdAt))
    .all()
    .map((s) => ({ id: s.id, name: s.name, createdAt: s.createdAt, inputs: JSON.parse(s.inputs) as CalculatorInputs }));
}

export function saveScenario(db: DB, userId: number, name: string, inputs: CalculatorInputs) {
  return db.insert(scenarios).values({ userId, name, inputs: JSON.stringify(inputs), createdAt: now() }).returning({ id: scenarios.id }).get().id;
}

export function deleteScenario(db: DB, userId: number, id: number) {
  return db.delete(scenarios).where(and(eq(scenarios.id, id), eq(scenarios.userId, userId))).run().changes > 0;
}

// ---------- checklist ----------
export function getChecklist(db: DB, userId: number): Set<string> {
  return new Set(db.select().from(checklistItems).where(eq(checklistItems.userId, userId)).all().map((r) => r.itemKey));
}

export function setChecklistItem(db: DB, userId: number, itemKey: string, checked: boolean) {
  if (checked) {
    db.insert(checklistItems).values({ userId, itemKey, checkedAt: now() }).onConflictDoNothing().run();
  } else {
    db.delete(checklistItems).where(and(eq(checklistItems.userId, userId), eq(checklistItems.itemKey, itemKey))).run();
  }
}

// ---------- news ----------
/** Ids of news items the user has opened. */
export function getReadNews(db: DB, userId: number): Set<string> {
  const rows = db.select({ itemId: newsReads.itemId }).from(newsReads).where(eq(newsReads.userId, userId)).all();
  return new Set(rows.map((r) => r.itemId));
}

export function markNewsRead(db: DB, userId: number, itemIds: readonly string[]) {
  if (itemIds.length === 0) return;
  const t = now();
  db.insert(newsReads)
    .values(itemIds.map((itemId) => ({ userId, itemId, readAt: t })))
    .onConflictDoNothing()
    .run();
}

/** Topics the user follows. An empty list means "all topics". */
export function getNewsPrefs(db: DB, userId: number): string[] {
  const row = db.select().from(newsPrefs).where(eq(newsPrefs.userId, userId)).get();
  if (!row) return [];
  try {
    const parsed = JSON.parse(row.topics);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function setNewsPrefs(db: DB, userId: number, topics: readonly string[]) {
  const value = JSON.stringify([...new Set(topics)]);
  db.insert(newsPrefs)
    .values({ userId, topics: value, updatedAt: now() })
    .onConflictDoUpdate({ target: newsPrefs.userId, set: { topics: value, updatedAt: now() } })
    .run();
}
