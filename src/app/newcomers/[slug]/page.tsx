import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getModules, getSupplement } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { ReviewNotice } from "@/components/ReviewNotice";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = getSupplement((await params).slug);
  return { title: s ? `${s.code}: ${s.title}` : "For newcomers" };
}

export default async function SupplementPage({ params }: P) {
  const s = getSupplement((await params).slug);
  if (!s) notFound();
  const modules = getModules().filter((m) => s.modules.includes(m.slug));
  return (
    <article className="container-page max-w-3xl pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft"><Link href="/newcomers" className="hover:text-cedar-700">For newcomers</Link> / {s.code}</nav>
      <p className="eyebrow mt-8 text-clay-700">{s.code}</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{s.title}</h1>
      <p className="mt-4 text-lg text-ink-soft">{s.summary}</p>
      {s.reviewNotice && <div className="mt-6"><ReviewNotice /></div>}
      <div className="mt-10"><Markdown source={s.body} /></div>
      <section aria-labelledby="links" className="mt-12 card p-6">
        <h2 id="links" className="text-xl">Sources and links</h2>
        <ul className="mt-3 space-y-2">
          {s.links.map((l) => (
            <li key={l.url}><a className="link" href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a> <span className="text-sm text-ink-soft">({l.source})</span></li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="mods" className="mt-6">
        <h2 id="mods" className="text-xl">Related course modules</h2>
        <ul className="mt-3 space-y-2">
          {modules.map((m) => <li key={m.slug}><Link className="link" href={`/course/${m.slug}`}>Module {m.number}: {m.title}</Link></li>)}
        </ul>
      </section>
    </article>
  );
}
