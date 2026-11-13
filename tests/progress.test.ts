import { beforeEach, describe, expect, it } from "vitest";
import { openDb, type DB } from "@/lib/db";
import { createUser, getCompletedLessons, getQuizResults, markLessonComplete, markLessonIncomplete, saveQuizResult, setLastLesson, getUser } from "@/lib/repo";
import { allLessons, getModules, moduleProgress, nextLesson } from "@/lib/content";
import { continueLesson } from "@/lib/progress";

let db: DB;
let uid: number;

beforeEach(async () => {
  db = openDb(":memory:");
  uid = await createUser(db, { email: "learner@example.com", name: "Learner", password: "correct horse battery" });
});

describe("lesson progress", () => {
  it("starts empty and points at the very first lesson", () => {
    const completed = getCompletedLessons(db, uid);
    expect(completed.size).toBe(0);
    expect(nextLesson(completed)?.key).toBe(allLessons()[0].key);
  });

  it("tracks completion per lesson and per module, idempotently", () => {
    const m0 = getModules()[0];
    for (const l of m0.lessons) markLessonComplete(db, uid, m0.slug, l.slug);
    markLessonComplete(db, uid, m0.slug, m0.lessons[0].slug); // duplicate is ignored
    const completed = getCompletedLessons(db, uid);
    expect(completed.size).toBe(m0.lessons.length);
    expect(moduleProgress(m0, completed)).toEqual({ done: m0.lessons.length, total: m0.lessons.length });
    expect(nextLesson(completed)?.module.number).toBe(1);
  });

  it("can un-complete a lesson", () => {
    const [first] = allLessons();
    markLessonComplete(db, uid, first.module.slug, first.lesson.slug);
    markLessonIncomplete(db, uid, first.module.slug, first.lesson.slug);
    expect(getCompletedLessons(db, uid).size).toBe(0);
  });

  it("'continue where you left off' prefers the last unfinished lesson visited", () => {
    const target = allLessons()[5];
    setLastLesson(db, uid, target.module.slug, target.lesson.slug);
    const u = getUser(db, uid)!;
    expect(continueLesson(u.lastModule, u.lastLesson, getCompletedLessons(db, uid))?.key).toBe(target.key);
    markLessonComplete(db, uid, target.module.slug, target.lesson.slug);
    expect(continueLesson(u.lastModule, u.lastLesson, getCompletedLessons(db, uid))?.key).toBe(allLessons()[0].key);
  });

  it("saves quiz results and keeps the latest attempt", () => {
    saveQuizResult(db, uid, "valuation-basics", [0, 1, 2, 3], 2, 4);
    saveQuizResult(db, uid, "valuation-basics", [1, 2, 1, 1], 4, 4);
    const r = getQuizResults(db, uid).get("valuation-basics");
    expect(r).toMatchObject({ correct: 4, total: 4, answers: [1, 2, 1, 1] });
  });
});
