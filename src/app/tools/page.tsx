import Link from "next/link";
import type { Metadata } from "next";
import { getTools } from "@/lib/content";

export const metadata: Metadata = { title: "Tools" };

export default function ToolsPage() {
  const tools = getTools();
  const working = tools.filter((t) => t.status === "working");
  const planned = tools.filter((t) => t.status === "planned");
  return (
    <div className="container-page pt-14">
      <header className="max-w-3xl">
        <p className="eyebrow">Tools</p>
        <h1 className="mt-3 text-5xl">Practise the work before it counts</h1>
        <p className="mt-4 text-lg text-ink-soft">Use these alongside the course. Signed-in users can save their work.</p>
      </header>
      <section aria-labelledby="working" className="mt-12">
        <h2 id="working" className="sr-only">Available now</h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {working.map((t) => (
            <li key={t.slug}>
              <Link href={t.href!} className="card group flex h-full flex-col p-8 hover:border-cedar-300">
                <span className="tag self-start bg-cedar-100 text-cedar-900">Available</span>
                <span className="mt-5 font-serif text-3xl text-cedar-900">{t.title}</span>
                <span className="mt-3 flex-1 text-ink-soft">{t.summary}</span>
                <span className="mt-6 font-medium text-cedar-700 group-hover:underline">Open the tool</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section id="planned" aria-labelledby="planned-h" className="mt-16 scroll-mt-24">
        <h2 id="planned-h" className="text-3xl">Planned</h2>
        <p className="mt-2 text-ink-soft">These are on the roadmap and not built yet.</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planned.map((t) => (
            <li key={t.slug} className="rounded-2xl border border-dashed border-line p-6">
              <span className="tag bg-paper-deep text-ink-soft">Planned</span>
              <h3 className="mt-3 text-xl">{t.title}</h3>
              <p className="mt-2 text-[15px] text-ink-soft">{t.summary}</p>
              {t.href && <Link className="link mt-3 inline-block text-sm" href={t.href}>Meanwhile, see the Deal Team guide</Link>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
