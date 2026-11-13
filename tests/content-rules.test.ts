import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getModules, getSupplements, REVIEW_NOTICE } from "@/lib/content";

function walk(dir: string, out: string[] = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|json|md|mdx|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

describe("review notices", () => {
  it("uses the exact notice text", () => {
    expect(REVIEW_NOTICE).toBe("Educational only, not advice. Pending professional review.");
  });

  it("flags financing, legal, tax and valuation modules", () => {
    const flagged = getModules().filter((m) => m.reviewNotice).map((m) => m.slug);
    for (const s of ["quality-of-earnings", "valuation-basics", "financing-in-canada", "loi-and-negotiation", "due-diligence", "legal-and-tax-structure", "closing-and-transition"]) {
      expect(flagged).toContain(s);
    }
  });

  it("flags the credit, financing and immigration-status supplements", () => {
    const flagged = getSupplements().filter((s) => s.reviewNotice).map((s) => s.code);
    expect(flagged).toEqual(expect.arrayContaining(["N1", "N2", "N5"]));
  });

  it("renders the notice on module, lesson and supplement pages", () => {
    for (const f of ["course/[module]/page.tsx", "course/[module]/[lesson]/page.tsx", "newcomers/[slug]/page.tsx"]) {
      expect(fs.readFileSync(path.join("src/app", f), "utf8")).toContain("<ReviewNotice />");
    }
  });

  it("keeps the hedging off the marketing pages", () => {
    for (const f of ["page.tsx", "pricing/page.tsx"]) {
      expect(fs.readFileSync(path.join("src/app", f), "utf8")).not.toContain("Pending professional review");
    }
  });
});

describe("language rules", () => {
  const files = [...walk("src"), ...walk("content"), "README.md"].filter((f) => fs.existsSync(f));

  it("never uses the word 'immigrants'", () => {
    for (const f of files) {
      expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/\bimmigrants?\b/i);
    }
  });

  it("marks all French as a draft", () => {
    const fr = fs.readFileSync("src/app/fr/page.tsx", "utf8");
    expect(fr).toContain("Brouillon");
    expect(fr).toContain("data-draft-notice");
  });

  it("does not claim a university affiliation", () => {
    for (const f of files) expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/(affiliated with|partnered with|endorsed by) (the )?(stanford|harvard|university)/i);
  });

  it("uses a [LOGO] slot rather than a final logo", () => {
    expect(fs.readFileSync("src/components/Logo.tsx", "utf8")).toContain("[LOGO]");
  });
});
