"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getNewsPrefs, getReadNews, markNewsRead, setNewsPrefs } from "@/lib/repo";
import { getNews, getNewsTopics, unreadItems } from "@/lib/news";

function refresh() {
  revalidatePath("/news");
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
}

/** Mark every unread item in the member's topics as read. */
export async function markAllNewsReadAction() {
  const user = await requireUser("/news");
  const db = getDb();
  const unread = unreadItems(getNews(), getReadNews(db, user.id), getNewsPrefs(db, user.id), user.createdAt);
  markNewsRead(db, user.id, unread.map((i) => i.id));
  refresh();
}

const topicsSchema = z.array(z.string()).max(20);

/** Save the topics a member follows. Choosing none means "all topics". */
export async function saveNewsTopicsAction(form: FormData) {
  const user = await requireUser("/news");
  const valid = new Set(getNewsTopics().map((t) => t.slug));
  const parsed = topicsSchema.safeParse(form.getAll("topic").map(String));
  const topics = parsed.success ? parsed.data.filter((t) => valid.has(t)) : [];
  setNewsPrefs(getDb(), user.id, topics);
  refresh();
}
