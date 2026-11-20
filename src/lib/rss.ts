/**
 * Minimal RSS 2.0 / Atom parser for the news importer. It keeps only the
 * headline, link and date: summaries are written by a person before an item
 * is published, so feed descriptions are never stored.
 */
export type FeedEntry = { title: string; url: string; date: string | null };

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : null;
}

function isoDate(raw: string | null): string | null {
  if (!raw) return null;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}

export function parseFeed(xml: string): FeedEntry[] {
  const out: FeedEntry[] = [];
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const block of items) {
    const title = tag(block, "title");
    const url = tag(block, "link") ?? tag(block, "guid");
    if (title && url) out.push({ title, url, date: isoDate(tag(block, "pubDate") ?? tag(block, "dc:date")) });
  }
  const entries = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  for (const block of entries) {
    const title = tag(block, "title");
    const href = block.match(/<link\b(?=[^>]*rel=["']alternate["'])[^>]*href=["']([^"']+)["']/i)?.[1] ?? block.match(/<link\b[^>]*href=["']([^"']+)["']/i)?.[1] ?? null;
    if (title && href) out.push({ title, url: decodeEntities(href), date: isoDate(tag(block, "published") ?? tag(block, "updated")) });
  }
  return out;
}

export function matchesKeywords(title: string, keywords: readonly string[]): boolean {
  const t = title.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
}

/** Stable id for a draft: date plus a slug of the title. */
export function draftId(entry: FeedEntry): string {
  const slug = entry.title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  return `${entry.date ?? "undated"}-${slug}`;
}
