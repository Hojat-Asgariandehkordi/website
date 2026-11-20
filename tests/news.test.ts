import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { openDb, type DB } from "@/lib/db";
import { createUser, getNewsPrefs, getReadNews, markNewsRead, setNewsPrefs } from "@/lib/repo";
import { filterByTopics, getNews, getNewsTopics, sortNews, unreadItems, type NewsItem } from "@/lib/news";
import { validateNewsItem } from "@/lib/news-rules";
import { decodeEntities, draftId, matchesKeywords, parseFeed } from "@/lib/rss";
import { getModule } from "@/lib/content";

const item = (id: string, date: string, topics: string[]): NewsItem => ({ id, date, title: id, source: "S", url: "https://example.com/" + id, topics, summary: "s", relatedModule: null });

describe("published news content", () => {
  const topics = getNewsTopics().map((t) => t.slug);
  const items = getNews();

  it("has items, newest first, with unique ids", () => {
    expect(items.length).toBeGreaterThan(0);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    for (let k = 1; k < items.length; k++) expect(items[k - 1].date >= items[k].date).toBe(true);
  });

  it("every item passes the publishing rules", () => {
    for (const i of items) expect(validateNewsItem(i, topics), i.id).toEqual([]);
  });

  it("related modules exist", () => {
    for (const i of items) if (i.relatedModule) expect(getModule(i.relatedModule), i.id).not.toBeNull();
  });
});

describe("news rules", () => {
  const ok = { id: "a-b", date: "2026-01-02", title: "T", source: "S", url: "https://x.ca", topics: ["eta"], summary: "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen", relatedModule: null };
  it("accepts a valid item", () => expect(validateNewsItem(ok, ["eta"])).toEqual([]));
  it("rejects empty or short summaries, unknown topics, http links and the banned word", () => {
    expect(validateNewsItem({ ...ok, summary: "" }, ["eta"]).length).toBeGreaterThan(0);
    expect(validateNewsItem({ ...ok, topics: ["nope"] }, ["eta"]).length).toBeGreaterThan(0);
    expect(validateNewsItem({ ...ok, url: "http://x.ca" }, ["eta"]).length).toBeGreaterThan(0);
    expect(validateNewsItem({ ...ok, title: "New rules for immigrants" }, ["eta"]).length).toBeGreaterThan(0);
  });
});

describe("filtering and unread", () => {
  const all = sortNews([item("a", "2026-10-01", ["eta"]), item("b", "2026-11-01", ["policy"]), item("c", "2025-01-01", ["eta"])]);
  const created = Date.parse("2026-10-15");

  it("sorts newest first", () => expect(all.map((i) => i.id)).toEqual(["b", "a", "c"]));
  it("an empty topic list keeps everything", () => expect(filterByTopics(all, [])).toHaveLength(3));
  it("filters by topic", () => expect(filterByTopics(all, ["policy"]).map((i) => i.id)).toEqual(["b"]));
  it("counts unread within the window and the member's topics", () => {
    expect(unreadItems(all, new Set(), [], created).map((i) => i.id)).toEqual(["b", "a"]);
    expect(unreadItems(all, new Set(["b"]), [], created).map((i) => i.id)).toEqual(["a"]);
    expect(unreadItems(all, new Set(), ["policy"], created).map((i) => i.id)).toEqual(["b"]);
  });
});

describe("news read state is private to each user", () => {
  let db: DB;
  let alice: number;
  let bob: number;
  beforeEach(async () => {
    db = openDb(":memory:");
    alice = await createUser(db, { email: "alice@example.com", name: "Alice", password: "alice-password-1" });
    bob = await createUser(db, { email: "bob@example.com", name: "Bob", password: "bob-password-12" });
  });

  it("marks items read for one user only, and repeats are harmless", () => {
    markNewsRead(db, alice, ["x", "y"]);
    markNewsRead(db, alice, ["x"]);
    expect([...getReadNews(db, alice)].sort()).toEqual(["x", "y"]);
    expect(getReadNews(db, bob).size).toBe(0);
  });

  it("stores topic preferences per user", () => {
    expect(getNewsPrefs(db, alice)).toEqual([]);
    setNewsPrefs(db, alice, ["eta", "eta", "policy"]);
    setNewsPrefs(db, alice, ["eta"]);
    expect(getNewsPrefs(db, alice)).toEqual(["eta"]);
    expect(getNewsPrefs(db, bob)).toEqual([]);
  });
});

describe("feed parser", () => {
  const rss = `<?xml version="1.0"?><rss><channel><title>Feed</title>
    <item><title>BDC &amp; succession loans</title><link>https://ex.ca/1</link><pubDate>Tue, 03 Nov 2026 10:00:00 GMT</pubDate><description>Long text</description></item>
    <item><title><![CDATA[Bridge funding]]></title><link>https://ex.ca/2</link></item>
  </channel></rss>`;
  const atom = `<feed><entry><title type="html">Search fund study</title><link rel="alternate" href="https://ex.ca/3?a=1&amp;b=2"/><published>2026-07-13T09:00:00Z</published><summary>x</summary></entry></feed>`;

  it("reads RSS items without keeping descriptions", () => {
    const e = parseFeed(rss);
    expect(e).toEqual([
      { title: "BDC & succession loans", url: "https://ex.ca/1", date: "2026-11-03" },
      { title: "Bridge funding", url: "https://ex.ca/2", date: null },
    ]);
  });
  it("reads Atom entries", () => expect(parseFeed(atom)).toEqual([{ title: "Search fund study", url: "https://ex.ca/3?a=1&b=2", date: "2026-07-13" }]));
  it("matches keywords case-insensitively", () => {
    expect(matchesKeywords("New SUCCESSION rules", ["succession"])).toBe(true);
    expect(matchesKeywords("Fisheries update", ["succession"])).toBe(false);
  });
  it("decodes entities and makes stable ids", () => {
    expect(decodeEntities("A &#38; B &#x2014; C")).toBe("A & B — C");
    expect(draftId({ title: "Hello, World!", url: "u", date: "2026-01-02" })).toBe("2026-01-02-hello-world");
  });
});

describe("news routes", () => {
  it("has the news list and item pages, and the item page requires sign-in", () => {
    expect(fs.existsSync(path.join("src/app/news/page.tsx"))).toBe(true);
    const detail = fs.readFileSync(path.join("src/app/news/[id]/page.tsx"), "utf8");
    expect(detail).toContain("requireUser(");
  });
  it("never sends email", () => {
    const src = fs.readFileSync("src/app/actions/news.ts", "utf8");
    expect(src).not.toMatch(/nodemailer|sendgrid|resend|smtp/i);
  });
});
