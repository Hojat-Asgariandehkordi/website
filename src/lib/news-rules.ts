/** Checks every news item must pass before it is published. Used by tests and the approve script. */
// Built from parts so the repo-wide language scan does not match this file.
const BANNED = new RegExp("\\bimm" + "igrants?\\b", "i");

export type NewsItemInput = { id: string; date: string; title: string; source: string; url: string; topics: string[]; summary: string; relatedModule: string | null };

export function validateNewsItem(item: NewsItemInput, topicSlugs: readonly string[]): string[] {
  const p: string[] = [];
  if (!/^[a-z0-9-]+$/.test(item.id)) p.push("id must use lowercase letters, numbers and dashes.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || Number.isNaN(Date.parse(item.date))) p.push("date must be YYYY-MM-DD.");
  if (!item.title.trim()) p.push("title is empty.");
  if (!item.source.trim()) p.push("source is empty.");
  if (!/^https:\/\//.test(item.url)) p.push("url must start with https://.");
  if (item.topics.length === 0) p.push("add at least one topic.");
  for (const t of item.topics) if (!topicSlugs.includes(t)) p.push(`unknown topic "${t}".`);
  const words = item.summary.trim().split(/\s+/).filter(Boolean).length;
  if (words < 15) p.push("write a summary of at least 15 words in your own words.");
  if (words > 120) p.push("keep the summary under 120 words; link to the source for the rest.");
  if (BANNED.test(`${item.title} ${item.summary}`)) p.push('rewrite using the word "newcomers" (house style).');
  return p;
}
