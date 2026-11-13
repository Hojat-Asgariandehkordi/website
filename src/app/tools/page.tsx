import Link from "next/link";
import type { Metadata } from "next";
import { getTools } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight, Calculator, ListChecks, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Tools" };

export default function ToolsPage() {
  const tools = getTools();
  const working = tools.filter((t) => t.status === "working");
  const planned = tools.filter((t) => t.status === "planned");
  return (
    <>
      <PageHeader eyebrow="Tools" title="Practise the work before it counts" intro="Use these alongside the course. Signed-in users can save their work." />
    <div className="container-page">
      <section aria-labelledby="working" className="mt-14">
        <h2 id="working" className="sr-only">Available now</h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {working.map((t) => (
            <li key={t.slug}>
              <Link href={t.href!} className="card card-hover group flex h-full flex-col p-8">
                <span className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cedar-900 text-cedar-100">{t.slug === "affordability" ? <Calculator size={20} aria-hidden="true" /> : <ListChecks size={20} aria-hidden="true" />}</span><span className="tag bg-cedar-100 text-cedar-900">Available</span></span>
                <span className="mt-5 font-serif text-3xl text-cedar-900">{t.title}</span>
                <span className="mt-3 flex-1 text-ink-soft">{t.summary}</span>
                <span className="mt-6 inline-flex items-center gap-1.5 font-medium text-cedar-700">Open the tool <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" /></span>
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
            <li key={t.slug} className="rounded-2xl border border-dashed border-line bg-white/40 p-6">
              <span className="tag gap-1 bg-paper-deep text-ink-soft"><Clock size={12} aria-hidden="true" /> Planned</span>
              <h3 className="mt-3 text-xl">{t.title}</h3>
              <p className="mt-2 text-[15px] text-ink-soft">{t.summary}</p>
              {t.href && <Link className="link mt-3 inline-block text-sm" href={t.href}>Meanwhile, see the Deal Team guide</Link>}
            </li>
          ))}
        </ul>
      </section>
    </div>
    </>
  );
}
