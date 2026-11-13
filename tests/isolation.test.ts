import { beforeEach, describe, expect, it } from "vitest";
import { openDb, type DB } from "@/lib/db";
import {
  addTeamMember, authenticate, createUser, deleteScenario, deleteTeamMember, getChecklist, getCompletedLessons,
  getQuizResults, listScenarios, listTeam, markLessonComplete, saveQuizResult, saveScenario, setChecklistItem, updateTeamMember,
} from "@/lib/repo";
import { DEFAULT_INPUTS } from "@/lib/calculator";
import { users } from "@/lib/schema";

let db: DB;
let alice: number;
let bob: number;

beforeEach(async () => {
  db = openDb(":memory:");
  alice = await createUser(db, { email: "alice@example.com", name: "Alice", password: "alice-password-1" });
  bob = await createUser(db, { email: "bob@example.com", name: "Bob", password: "bob-password-12" });
});

describe("accounts", () => {
  it("stores a hash, never the password", () => {
    const rows = db.select().from(users).all();
    for (const r of rows) {
      expect(r.passwordHash).not.toContain("password");
      expect(r.passwordHash).toMatch(/^\$2[aby]\$/);
    }
  });
  it("authenticates only with the right password, and emails are case-insensitive", async () => {
    expect(await authenticate(db, "ALICE@example.com", "alice-password-1")).toBe(alice);
    expect(await authenticate(db, "alice@example.com", "wrong")).toBeNull();
    await expect(createUser(db, { email: "Alice@Example.com", name: "x", password: "whatever-123" })).rejects.toThrow("EMAIL_TAKEN");
  });
});

describe("user data isolation", () => {
  it("keeps deal team lists separate, and blocks cross-user edits and deletes", () => {
    const id = addTeamMember(db, alice, { name: "A's lawyer", firm: "Firm", role: "lawyer", status: "talking", notes: "private" });
    expect(listTeam(db, bob)).toHaveLength(0);
    expect(updateTeamMember(db, bob, id, { name: "hijacked", firm: "", role: "lawyer", status: "engaged", notes: "" })).toBe(false);
    expect(deleteTeamMember(db, bob, id)).toBe(false);
    expect(listTeam(db, alice)[0]).toMatchObject({ name: "A's lawyer", notes: "private" });
    expect(deleteTeamMember(db, alice, id)).toBe(true);
  });

  it("keeps calculator scenarios separate", () => {
    const id = saveScenario(db, alice, "Alice deal", DEFAULT_INPUTS);
    expect(listScenarios(db, bob)).toHaveLength(0);
    expect(deleteScenario(db, bob, id)).toBe(false);
    expect(listScenarios(db, alice)).toHaveLength(1);
  });

  it("keeps lesson progress, quiz results and checklists separate", () => {
    markLessonComplete(db, alice, "is-buying-right-for-me", "what-is-eta");
    saveQuizResult(db, alice, "is-buying-right-for-me", [1, 2, 1, 1], 4, 4);
    setChecklistItem(db, alice, "thesis", true);
    expect(getCompletedLessons(db, bob).size).toBe(0);
    expect(getQuizResults(db, bob).size).toBe(0);
    expect(getChecklist(db, bob).size).toBe(0);
    expect(getChecklist(db, alice).has("thesis")).toBe(true);
  });
});
