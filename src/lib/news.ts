import fs from "node:fs";
import path from "node:path";

export type NewsTopic = { slug: string; label: string };
export type NewsItem = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  source: string;
  url: string;
  topics: string[];
  summary: string;
  relatedModule: string | null;
};
type NewsFile = { topics: NewsTopic[]; items: NewsItem[] };

/** How many headlines signed-out visitors can see. */
export const PUBLIC_TEASER_COUNT = 3;
/** Items older than this (relative to account creation) never count as unread. */
export const UNREAD_WINDOW_DAYS = 45;

const NEWS_PATH = path.join(process.cwd(), "content", "news.json");

function load(): NewsFile {
  return JSON.parse(fs.readFileSync(NEWS_PATH, "utf8")) as NewsFile;
}

export function getNewsTopics(): NewsTopic[] {
  return load().topics;
}

/** Published items, newest first. */
export function getNews(): NewsItem[] {
  return sortNews(load().items);
}

export function getNewsItem(id: string): NewsItem | null {
  return load().items.find((i) => i.id === id) ?? null;
}

export function sortNews(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id.localeCompare(b.id)));
}

/** Keep items tagged with any of the given topics. An empty list keeps everything. */
export function filterByTopics(items: NewsItem[], topics: readonly string[]): NewsItem[] {
  if (topics.length === 0) return items;
  const want = new Set(topics);
  return items.filter((i) => i.topics.some((t) => want.has(t)));
}

/**
 * Items a member has not opened yet. Only items in their chosen topics count,
 * and only items dated within UNREAD_WINDOW_DAYS before the account was created
 * or later, so a brand-new account does not start with a long backlog.
 */
export function unreadItems(items: NewsItem[], read: ReadonlySet<string>, topics: readonly string[], accountCreatedAt: number): NewsItem[] {
  const cutoff = new Date(accountCreatedAt - UNREAD_WINDOW_DAYS * 86_400_000).toISOString().slice(0, 10);
  return filterByTopics(items, topics).filter((i) => !read.has(i.id) && i.date >= cutoff);
}

export function formatNewsDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
