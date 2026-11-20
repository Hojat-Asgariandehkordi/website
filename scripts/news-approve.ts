/**
 * Publish a reviewed draft from data/news-drafts.json to content/news.json.
 *
 *   npm run news:approve -- <draft-id>
 *   npm run news:approve -- --list
 *
 * The draft must have a summary written in your own words. Edit the draft's
 * "summary" (and "topics", "relatedModule" if you like) in data/news-drafts.json first.
 */
import fs from "node:fs";
import path from "node:path";
import { validateNewsItem } from "../src/lib/news-rules";

const ROOT = process.cwd();
const NEWS = path.join(ROOT, "content", "news.json");
const DRAFTS = path.join(ROOT, "data", "news-drafts.json");

type Draft = { id: string; date: string; title: string; source: string; url: string; topics: string[]; summary: string; relatedModule?: string | null };

const arg = process.argv[2];
const drafts: Draft[] = fs.existsSync(DRAFTS) ? JSON.parse(fs.readFileSync(DRAFTS, "utf8")) : [];

if (!arg || arg === "--list") {
  if (drafts.length === 0) console.log("No drafts. Run npm run news:fetch first.");
  for (const d of drafts) console.log(`${d.summary.trim() ? "ready " : "needs summary"}  ${d.id}\n      ${d.title}`);
  process.exit(0);
}

const draft = drafts.find((d) => d.id === arg);
if (!draft) {
  console.error(`No draft with id "${arg}". Run with --list to see them.`);
  process.exit(1);
}

const news = JSON.parse(fs.readFileSync(NEWS, "utf8"));
const topicSlugs: string[] = news.topics.map((t: { slug: string }) => t.slug);
const item = { id: draft.id, date: draft.date, title: draft.title, source: draft.source, url: draft.url, topics: draft.topics, summary: draft.summary.trim(), relatedModule: draft.relatedModule ?? null };
const problems = validateNewsItem(item, topicSlugs);
if (news.items.some((i: { id: string }) => i.id === item.id)) problems.push("An item with this id is already published.");
if (problems.length) {
  console.error(`Not published:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

news.items.push(item);
fs.writeFileSync(NEWS, JSON.stringify(news, null, 2) + "\n");
fs.writeFileSync(DRAFTS, JSON.stringify(drafts.filter((d) => d.id !== draft.id), null, 2) + "\n");
console.log(`Published "${item.title}". Run npm run check, then commit content/news.json.`);
