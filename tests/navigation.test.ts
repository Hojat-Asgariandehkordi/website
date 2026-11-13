import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ACCOUNT_NAV, MAIN_NAV } from "@/lib/nav";
import { getModules, getRoles, getSupplements, getTools, getChecklist } from "@/lib/content";

const APP = path.join(process.cwd(), "src", "app");
const pageExists = (route: string) => {
  const segs = route.split("/").filter(Boolean);
  return fs.existsSync(path.join(APP, ...segs, "page.tsx"));
};

describe("navigation", () => {
  it("has the main navigation in the required order", () => {
    expect(MAIN_NAV.map((n) => n.label)).toEqual(["Course", "Deal Team", "Tools", "For newcomers", "Pricing"]);
  });

  it("offers Sign in, Create account and Dashboard", () => {
    expect(ACCOUNT_NAV.signedOut.map((n) => n.label)).toEqual(["Sign in", "Create account"]);
    expect(ACCOUNT_NAV.signedIn.map((n) => n.label)).toEqual(["Dashboard"]);
  });

  it("every navigation link has a page", () => {
    for (const n of [...MAIN_NAV, ...ACCOUNT_NAV.signedOut, ...ACCOUNT_NAV.signedIn]) expect(pageExists(n.href), n.href).toBe(true);
    for (const r of ["/", "/fr", "/tools/affordability", "/tools/checklist"]) expect(pageExists(r), r).toBe(true);
  });

  it("dynamic course and newcomer routes exist", () => {
    expect(fs.existsSync(path.join(APP, "course", "[module]", "page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(APP, "course", "[module]", "[lesson]", "page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(APP, "newcomers", "[slug]", "page.tsx"))).toBe(true);
  });

  it("all cross-links in content point at real modules, tools and pages", () => {
    const moduleSlugs = new Set(getModules().map((m) => m.slug));
    const tools = new Map(getTools().map((t) => [t.slug, t]));
    for (const m of getModules()) {
      const t = tools.get(m.relatedTool.slug);
      expect(t, `${m.slug} related tool`).toBeTruthy();
      expect(t!.status).toBe(m.relatedTool.status);
      if (t!.status === "working") expect(pageExists(`/tools/${t!.slug}`)).toBe(true);
      for (const s of m.newcomerSupplements) expect(getSupplements().some((x) => x.slug === s), s).toBe(true);
    }
    for (const s of getSupplements()) for (const ms of s.modules) expect(moduleSlugs.has(ms), ms).toBe(true);
    for (const g of getChecklist()) for (const i of g.items) if (i.module) expect(moduleSlugs.has(i.module), i.module).toBe(true);
    for (const t of getTools()) if (t.href) expect(pageExists(t.href), t.href).toBe(true);
  });

  it("deal team covers every required role", () => {
    expect(getRoles().map((r) => r.slug)).toEqual(["business-broker", "lawyer", "accountant", "lender", "valuator", "insurance-advisor", "mentor", "newcomer-programs"]);
    for (const r of getRoles()) {
      for (const k of ["does", "doesNot", "whenYouNeed", "questions"] as const) expect(r[k].length, `${r.slug}.${k}`).toBeGreaterThan(0);
    }
  });
});
