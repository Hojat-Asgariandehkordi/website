import Link from "next/link";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getNewsPrefs, getReadNews } from "@/lib/repo";
import { filterByTopics, getNews, getNewsTopics, PUBLIC_TEASER_COUNT, unreadItems } from "@/lib/news";
import { PageHeader } from "@/components/PageHeader";
import { NewsCard } from "@/components/NewsCard";
import { markAllNewsReadAction, saveNewsTopicsAction } from "@/app/actions/news";

export const metadata: Metadata = { title: "News" };
export const dynamic = "force-dynamic";

type P = { searchParams: Promise<{ topic?: string }> };

export default async function NewsPage({ searchParams }: P) {
  const user = await currentUser();
  const items = getNews();
  const topics = getNewsTopics();

  if (!user) {
    const teaser = items.slice(0, PUBLIC_TEASER_COUNT);
    return (
      <>
        <PageHeader eyebrow="News" title="ETA and succession news, in plain language" intro="Short summaries of what is changing for people buying a small business in Canada, with a link to every original source." />
        <div className="container-page mt-12 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section aria-labelledby="latest">
            <h2 id="latest" className="text-2xl">Latest headlines</h2>
            <ul className="mt-5 space-y-5">
              {teaser.map((i) => <li key={i.id}><NewsCard item={i} topics={topics} linkToDetail={false} /></li>)}
            </ul>
          </section>
          <aside className="card h-fit p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cedar-900 text-cedar-100"><Lock size={20} aria-hidden="true" /></span>
            <h2 className="mt-4 text-2xl">See every update</h2>
            <p className="mt-2 text-[15px] text-ink-soft">Members get all {items.length} updates, can choose the topics they follow and see what is new since their last visit.</p>
            <Link href="/sign-up?next=/news" className="btn-primary mt-5 w-full justify-center">Create free account</Link>
            <Link href="/sign-in?next=/news" className="link mt-3 inline-block text-sm">I already have an account</Link>
          </aside>
        </div>
      </>
    );
  }

  const db = getDb();
  const read = getReadNews(db, user.id);
  const prefs = getNewsPrefs(db, user.id);
  const unread = new Set(unreadItems(items, read, prefs, user.createdAt).map((i) => i.id));
  const selected = (await searchParams).topic ?? "";
  const view = selected === "mine" ? filterByTopics(items, prefs) : topics.some((t) => t.slug === selected) ? filterByTopics(items, [selected]) : items;
  const chip = (href: string, label: string, active: boolean) => (
    <Link href={href} aria-current={active ? "page" : undefined} className={`tag px-3 py-1.5 text-sm ${active ? "bg-cedar-900 text-paper" : "bg-white text-cedar-900 ring-1 ring-line hover:ring-cedar-300"}`}>{label}</Link>
  );

  return (
    <>
      <PageHeader eyebrow="News" title="ETA and succession news" intro="Short summaries in our own words, with a link to every original source. Check the source before acting on anything here.">
        <div className="card flex items-center justify-between gap-4 p-5">
          <p className="text-[15px]"><span className="font-serif text-3xl text-cedar-900">{unread.size}</span> <span className="text-ink-soft">new {unread.size === 1 ? "update" : "updates"}{prefs.length > 0 ? " in your topics" : ""}</span></p>
          {unread.size > 0 && (
            <form action={markAllNewsReadAction}><button type="submit" className="btn-secondary py-2 text-sm">Mark all as read</button></form>
          )}
        </div>
      </PageHeader>
      <div className="container-page mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section aria-labelledby="feed">
          <h2 id="feed" className="sr-only">Updates</h2>
          <nav aria-label="Filter by topic" className="flex flex-wrap gap-2">
            {chip("/news", "All", selected === "")}
            {prefs.length > 0 && chip("/news?topic=mine", "My topics", selected === "mine")}
            {topics.map((t) => <span key={t.slug}>{chip(`/news?topic=${t.slug}`, t.label, selected === t.slug)}</span>)}
          </nav>
          {view.length === 0 ? (
            <p className="mt-8 text-ink-soft">No updates in this topic yet.</p>
          ) : (
            <ul className="mt-6 space-y-5">
              {view.map((i) => <li key={i.id}><NewsCard item={i} topics={topics} unread={unread.has(i.id)} /></li>)}
            </ul>
          )}
        </section>
        <aside className="card h-fit p-6">
          <h2 className="text-xl">Topics you follow</h2>
          <p className="mt-1 text-sm text-ink-soft">New updates are counted only for these topics. Leave all unticked to follow everything.</p>
          <form action={saveNewsTopicsAction} className="mt-4 space-y-2">
            {topics.map((t) => (
              <label key={t.slug} className="flex items-center gap-2 text-[15px]">
                <input type="checkbox" name="topic" value={t.slug} defaultChecked={prefs.includes(t.slug)} className="h-4 w-4 accent-cedar-700" />
                {t.label}
              </label>
            ))}
            <button type="submit" className="btn-primary mt-3 w-full justify-center py-2 text-sm">Save topics</button>
          </form>
          <p className="mt-5 border-t border-line pt-4 text-xs text-ink-soft">News is shown on the site only. We do not send emails.</p>
        </aside>
      </div>
    </>
  );
}
