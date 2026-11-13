import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="container-page pt-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Pricing</p>
        <h1 className="mt-3 text-5xl">Start free. Go further when you&apos;re ready.</h1>
      </header>
      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        <section aria-labelledby="free" className="card flex flex-col p-8">
          <h2 id="free" className="text-2xl">Free preview</h2>
          <p className="mt-2 font-serif text-5xl text-cedar-900">$0</p>
          <ul className="mt-6 flex-1 space-y-2 text-[15px]">
            <li>Modules 0 and 1, with quizzes and practical outputs</li>
            <li>The Deal Team guide and your private team list</li>
            <li>The affordability calculator and deal-readiness checklist</li>
            <li>All six newcomer supplements</li>
          </ul>
          <Link href="/sign-up?next=/course" className="btn-primary mt-8">Create a free account</Link>
        </section>
        <section aria-labelledby="indiv" className="flex flex-col rounded-2xl border-2 border-cedar-700 bg-paper-card p-8">
          <div className="flex items-center justify-between">
            <h2 id="indiv" className="text-2xl">Individual package</h2>
            <span className="tag bg-brass-100 text-ink">Placeholder</span>
          </div>
          <p className="mt-2 font-serif text-5xl text-cedar-900">$199 <span className="text-lg text-ink-soft">CAD, one-time</span></p>
          <p className="mt-6 flex-1 text-[15px] text-ink-soft">Package contents are still being decided.</p>
          <button type="button" disabled aria-disabled="true" className="btn-disabled mt-8">Coming soon</button>
          <p className="mt-3 text-xs text-ink-soft">No payment is taken on this site.</p>
        </section>
      </div>
    </div>
  );
}
