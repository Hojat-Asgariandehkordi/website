"use client";

import Link from "next/link";
import { useState } from "react";

export type Phase = {
  name: string;
  range: string;
  blurb: string;
  modules: { slug: string; num: string; title: string; output: string }[];
};

export function PhaseTabs({ phases }: { phases: Phase[] }) {
  const [sel, setSel] = useState(0);
  const p = phases[sel];
  return (
    <div>
      <div role="group" aria-label="Course phases" className="mt-12 flex flex-wrap gap-2 border-b border-line pb-4">
        {phases.map((ph, i) => (
          <button
            key={ph.name}
            type="button"
            aria-pressed={i === sel}
            onClick={() => setSel(i)}
            className={`rounded-[10px] border px-4 py-2.5 text-[14.5px] transition-colors ${
              i === sel ? "border-[#10241A] bg-[#10241A] font-semibold text-paper" : "border-line bg-paper-card font-medium text-ink hover:border-cedar-300"
            }`}
          >
            {ph.name}
          </button>
        ))}
      </div>
      <div key={sel} className="mt-7 grid gap-6 lg:grid-cols-3" aria-live="polite">
        <div className="flex min-h-[300px] animate-fadein flex-col justify-between rounded-[20px] bg-[#10241A] p-9 text-paper">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E6CC8A]">{p.range}</p>
            <p className="mt-3.5 font-serif text-[44px] font-[350] leading-[1.05] tracking-[-0.02em]">{p.name}</p>
            <p className="mt-3.5 text-[16px] text-[#B9C8BE]">{p.blurb}</p>
          </div>
          <Link href={`/course/${p.modules[0].slug}`} className="mt-6 text-[15px] font-semibold text-[#E6CC8A] hover:underline">Open Module {Number(p.modules[0].num)}</Link>
        </div>
        {p.modules.map((m, i) => (
          <Link key={m.slug} href={`/course/${m.slug}`} style={{ animationDelay: `${(i + 1) * 90}ms` }} className="group flex min-h-[300px] animate-fadein flex-col rounded-[20px] border border-line bg-paper-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <p className="font-serif text-[64px] font-light leading-none text-[#7FA08A]">{m.num}</p>
            <p className="mt-4 flex-1 font-serif text-[26px] leading-tight tracking-[-0.01em] text-ink group-hover:text-cedar-700">{m.title}</p>
            <div className="mt-6 border-t border-line pt-4">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">You produce</p>
              <p className="mt-1 text-[15.5px] font-semibold">{m.output}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
