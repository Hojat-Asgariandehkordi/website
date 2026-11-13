import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Pricing" };

const FREE = [
  "Modules 0 and 1, with quizzes and practical outputs",
  "The Deal Team guide and your private team list",
  "The affordability calculator and deal-readiness checklist",
  "All six newcomer supplements",
];

export default function PricingPage() {
  return (
    <>
      <PageHeader eyebrow="Pricing" title="Start free. Go further when you're ready." />
      <div className="container-page">
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <section aria-labelledby="free" className="card flex flex-col p-9">
            <h2 id="free" className="text-2xl">Free preview</h2>
            <p className="mt-3 font-serif text-6xl text-cedar-900">$0</p>
            <ul className="mt-8 flex-1 space-y-3 text-[15px]">
              {FREE.map((f) => (
                <li key={f} className="flex gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cedar-100 text-cedar-900"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>{f}</li>
              ))}
            </ul>
            <Link href="/sign-up?next=/course" className="btn-primary mt-9">Create a free account <ArrowRight size={16} aria-hidden="true" /></Link>
          </section>
          <section aria-labelledby="indiv" className="relative flex flex-col overflow-hidden rounded-2xl bg-cedar-900 p-9 text-paper shadow-lift">
            <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brass-500/30 blur-[90px]" />
            <div className="relative flex items-center justify-between">
              <h2 id="indiv" className="text-2xl text-paper">Individual package</h2>
              <span className="tag bg-white/10 text-cedar-100 ring-1 ring-white/20">Placeholder</span>
            </div>
            <p className="relative mt-3 font-serif text-6xl">$199 <span className="font-sans text-base text-paper/70">CAD, one-time</span></p>
            <p className="relative mt-8 flex-1 text-[15px] text-paper/75">Package contents are still being decided.</p>
            <button type="button" disabled aria-disabled="true" className="btn relative mt-9 border border-white/20 bg-white/10 text-paper/80">Coming soon</button>
            <p className="relative mt-3 text-xs text-paper/60">No payment is taken on this site.</p>
          </section>
        </div>
      </div>
    </>
  );
}
