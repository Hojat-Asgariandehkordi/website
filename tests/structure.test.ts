import { describe, expect, it } from "vitest";
import { getModules, getSupplements, getTools } from "@/lib/content";

const EXPECTED_OUTPUTS = [
  "Personal fit statement", "One-page thesis", "Target list and outreach letter", "Screening memo", "Adjusted earnings sheet",
  "Valuation range", "Capital stack and lender pack checklist", "Practice LOI term sheet", "Due-diligence findings log",
  "Questions for your lawyer and CPA", "100-day plan", "One-page deal pitch",
];

describe("12-module course structure", () => {
  const modules = getModules();

  it("has exactly 12 modules numbered 0 to 11 with unique slugs", () => {
    expect(modules.map((m) => m.number)).toEqual([...Array(12).keys()]);
    expect(new Set(modules.map((m) => m.slug)).size).toBe(12);
  });

  it("gives each module the required practical output", () => {
    expect(modules.map((m) => m.practicalOutput.title)).toEqual(EXPECTED_OUTPUTS);
  });

  it.each(modules.map((m) => [m.number, m] as const))("module %i has every required part", (_, m) => {
    expect(m.outcomes.length).toBeGreaterThan(0);
    expect(m.lessons.length).toBeGreaterThan(0);
    for (const l of m.lessons) {
      expect(l.body.length).toBeGreaterThan(200);
      expect(l.video).toHaveProperty("url");
    }
    expect(m.video).toHaveProperty("url");
    expect(m.readings.length).toBeGreaterThanOrEqual(2);
    for (const r of m.readings) {
      expect(["FREE", "PAID"]).toContain(r.access);
      expect(r.url).toMatch(/^https:\/\//);
    }
    expect(m.practicalOutput.steps.length).toBeGreaterThan(0);
    expect(m.quiz.length).toBeGreaterThanOrEqual(3);
    for (const q of m.quiz) {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
    }
    expect(m.relatedTool.slug).toBeTruthy();
  });

  it("starts with no videos, so no player is faked", () => {
    for (const m of modules) {
      expect(m.video.url).toBeNull();
      for (const l of m.lessons) expect(l.video.url).toBeNull();
    }
  });

  it("has six newcomer supplements N1 to N6", () => {
    expect(getSupplements().map((s) => s.code)).toEqual(["N1", "N2", "N3", "N4", "N5", "N6"]);
  });

  it("lists the working and planned tools", () => {
    const tools = getTools();
    expect(tools.filter((t) => t.status === "working").map((t) => t.slug)).toEqual(["affordability", "checklist"]);
    expect(tools.filter((t) => t.status === "planned")).toHaveLength(9);
  });
});
