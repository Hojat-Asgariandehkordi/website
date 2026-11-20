/**
 * Pull headlines from the public feeds in content/news-feeds.json and add the
 * ones that match a keyword to data/news-drafts.json for review.
 *
 *   npm run news:fetch
 *
 * Only the headline, link and date are kept. A person writes the summary in
 * their own words, then publishes with `npm run news:approve -- <id>`.
 * Nothing is published automatically.
 */
import fs from "node:fs";
import path from "node:path";
import { draftId, matchesKeywords, parseFeed } from "../src/lib/rss";

type Feed = { name: string; url: string; source: string; topics: string[] };
type FeedsFile = { keywords: string[]; feeds: Feed[] };
export type Draft = { id: string; date: string; title: string; source: string; url: string; topics: string[]; summary: string; feed: string; foundAt: string };

const ROOT = process.cwd();
const FEEDS = path.join(ROOT, "content", "news-feeds.json");
const NEWS = path.join(ROOT, "content", "news.json");
export const DRAFTS = path.join(ROOT, "data", "news-drafts.json");

function readJson<T>(p: string, fallback: T): T {
  return fs.existsSync(p) ? (JSON.parse(fs.readFileSync(p, "utf8")) as T) : fallback;
}

async function main() {
  const { keywords, feeds } = readJson<FeedsFile>(FEEDS, { keywords: [], feeds: [] });
  const published = new Set(readJson<{ items: { url: string }[] }>(NEWS, { items: [] }).items.map((i) => i.url));
  const drafts = readJson<Draft[]>(DRAFTS, []);
  const known = new Set([...published, ...drafts.map((d) => d.url)]);
  let added = 0;

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, { headers: { "user-agent": "NextOwner news importer" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const entries = parseFeed(await res.text()).filter((e) => matchesKeywords(e.title, keywords));
      for (const e of entries) {
        if (known.has(e.url)) continue;
        known.add(e.url);
        drafts.push({ id: draftId(e), date: e.date ?? new Date().toISOString().slice(0, 10), title: e.title, source: feed.source, url: e.url, topics: feed.topics, summary: "", feed: feed.name, foundAt: new Date().toISOString() });
        added++;
      }
      console.log(`${feed.name}: ${entries.length} matching`);
    } catch (err) {
      console.warn(`${feed.name}: skipped (${(err as Error).message})`);
    }
  }

  fs.mkdirSync(path.dirname(DRAFTS), { recursive: true });
  fs.writeFileSync(DRAFTS, JSON.stringify(drafts, null, 2) + "\n");
  console.log(`\n${added} new drafts. ${drafts.length} waiting in data/news-drafts.json.`);
  console.log("Write a summary for each one you want, then run: npm run news:approve -- <id>");
}

main();
