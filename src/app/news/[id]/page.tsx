import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { markNewsRead } from "@/lib/repo";
import { formatNewsDate, getNewsItem, getNewsTopics } from "@/lib/news";
import { getModule } from "@/lib/content";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const item = getNewsItem((await params).id);
  return { title: item ? item.title : "News" };
}

export default async function NewsItemPage({ params }: P) {
  const { id } = await params;
  const user = await requireUser(`/news/${id}`);
  const item = getNewsItem(id);
  if (!item) notFound();
  markNewsRead(getDb(), user.id, [item.id]);
  const topics = getNewsTopics();
  const mod = item.relatedModule ? getModule(item.relatedModule) : null;

  return (
    <article className="container-page max-w-3xl pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft"><Link href="/news" className="hover:text-cedar-700">News</Link> / Update</nav>
      <p className="mt-8 text-sm text-ink-soft"><time dateTime={item.date}>{formatNewsDate(item.date)}</time> · {item.source}</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{item.title}</h1>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
        {item.topics.map((t) => <li key={t} className="tag bg-paper-deep text-ink-soft">{topics.find((x) => x.slug === t)?.label ?? t}</li>)}
      </ul>
      <p className="mt-8 text-lg leading-relaxed">{item.summary}</p>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
        Read the original at {item.source} <ExternalLink size={16} aria-hidden="true" />
      </a>
      <p className="mt-4 text-sm text-ink-soft">This summary is ours. The original source is the authority: check it before acting on anything.</p>
      {mod && (
        <section aria-labelledby="related" className="card mt-12 p-6">
          <h2 id="related" className="text-xl">Related in the course</h2>
          <Link className="link mt-2 inline-block" href={`/course/${mod.slug}`}>Module {mod.number}: {mod.title}</Link>
        </section>
      )}
    </article>
  );
}
