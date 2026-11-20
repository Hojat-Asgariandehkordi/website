import Link from "next/link";
import type { NewsItem, NewsTopic } from "@/lib/news";
import { formatNewsDate } from "@/lib/news";

export function NewsCard({ item, topics, unread = false, linkToDetail = true }: { item: NewsItem; topics: NewsTopic[]; unread?: boolean; linkToDetail?: boolean }) {
  const label = (slug: string) => topics.find((t) => t.slug === slug)?.label ?? slug;
  return (
    <article className={`card relative p-6 sm:p-7 ${unread ? "border-cedar-300" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
        {unread && <span className="tag bg-cedar-700 text-paper">New</span>}
        <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{item.source}</span>
      </div>
      <h3 className="mt-3 text-2xl leading-snug">
        {linkToDetail ? (
          <Link href={`/news/${item.id}`} className="hover:text-cedar-700">{item.title}</Link>
        ) : (
          item.title
        )}
      </h3>
      <p className="mt-3 text-[15px] text-ink-soft">{item.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
        {item.topics.map((t) => <li key={t} className="tag bg-paper-deep text-ink-soft">{label(t)}</li>)}
      </ul>
    </article>
  );
}
