import Link from "next/link";
import { ArrowRight, BookMarked, Calculator, Check, Globe2, Home, Lock, NotebookText, Plus, Users } from "lucide-react";
import { getModules, getSupplements } from "@/lib/content";
import { PhaseTabs, type Phase } from "@/components/PhaseTabs";
import { calculate, DEFAULT_INPUTS, formatCad } from "@/lib/calculator";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

const PHASE_BLURBS: Record<string, string> = {
  Decide: "Work out whether buying fits your money, time and family, then write the thesis that guides your search.",
  Find: "Source deals through brokers, direct outreach and Canadian programs, then screen them quickly.",
  Analyze: "Test whether the earnings are real and repeatable, then build a value range you can defend.",
  "Finance and negotiate": "Understand the Canadian capital stack and put your terms in a letter of intent.",
  "Verify and structure": "Run diligence with your team and prepare good questions for your lawyer and CPA.",
  Own: "Close well, lead the first hundred days and pitch a deal to a mock committee.",
};

const FAQ = [
  { q: "Who is NextOwner for?", a: "Anyone in Canada seriously considering buying an existing small business, whether you're early in the idea or already reading listings." },
  { q: "Do I need to be a newcomer?", a: "No. The course is for every buyer. Newcomers get six extra supplements, and anyone can read them." },
  { q: "Will NextOwner find a business for me?", a: "No. NextOwner prepares you to search, evaluate and buy. It has no listings and never contacts sellers for you." },
  { q: "What does it cost?", a: "Modules 0 and 1, the Deal Team guide, the tools and the newcomer supplements are free. A paid package is planned." },
  { q: "Is there a French version?", a: "A French landing page exists as a draft. The full course is in English for now." },
];

function Tick() {
  return <Check size={16} strokeWidth={2.4} className="text-[#7FA08A]" aria-hidden="true" />;
}

export default function HomePage() {
  const modules = getModules();
  const lessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const sups = getSupplements();

  const phases: Phase[] = [];
  for (const m of modules) {
    const mod = { slug: m.slug, num: String(m.number).padStart(2, "0"), title: m.title, output: m.practicalOutput.title };
    const last = phases[phases.length - 1];
    if (last && last.name === m.phase) last.modules.push(mod);
    else phases.push({ name: m.phase, range: "", blurb: PHASE_BLURBS[m.phase] ?? "", modules: [mod] });
  }
  phases.forEach((p, i) => {
    p.range = `Phase ${i + 1} · Modules ${Number(p.modules[0].num)}–${Number(p.modules[p.modules.length - 1].num)}`;
  });

  // Example scenario, computed with the real calculator so the numbers are always correct.
  const example = { ...DEFAULT_INPUTS, purchasePrice: 800_000, closingCosts: 0 };
  const ex = calculate(example);
  const exampleNote = `Example: bank ${example.bankRatePct}% over ${example.bankTermYears} years, seller note ${example.sellerRatePct}% over ${example.sellerTermYears} years, ${formatCad(example.annualSde)} annual cash flow.`;

  const facts = [
    { v: modules.length, l: "modules, from decision to day 100" },
    { v: lessons, l: "written lessons with readings" },
    { v: modules.length, l: "practical outputs you produce" },
    { v: 8, l: "Deal Team roles explained" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-[72px] overflow-hidden bg-[#10241A] pt-[72px] text-paper">
        <div aria-hidden="true" className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div aria-hidden="true" className="absolute -right-44 top-20 h-[720px] w-[720px] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(201,167,90,.22),rgba(201,167,90,0))]" />

        <div className="container-page relative grid gap-16 pb-40 pt-20 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <Link href="/newcomers" className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-[#E6CC8A]/35 py-1.5 pl-2 pr-3.5 text-[13px] text-[#E6CC8A] hover:border-[#E6CC8A]/60">
              <span className="rounded-full bg-[#E6CC8A] px-2 py-0.5 text-[11px] font-semibold text-[#10241A]">New</span>
              The newcomer pathway is here
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <h1 className="mt-8 animate-rise font-serif [animation-delay:120ms] text-[46px] font-[350] leading-[0.98] tracking-[-0.03em] text-paper sm:text-[64px] lg:text-[80px]">
              Prepare to buy a small business in Canada with a <em className="text-shine animate-shine font-light">clearer map.</em>
            </h1>
            <p className="mt-8 max-w-[520px] animate-rise text-[19px] [animation-delay:240ms] leading-[1.65] text-[#B9C8BE]">
              A structured course, a guide to the professionals you&apos;ll need and tools to test the numbers, so you can make an offer with confidence.
            </p>
            <div className="mt-10 flex animate-rise flex-wrap items-center gap-3.5 [animation-delay:360ms]">
              <Link href="/course" className="btn group rounded-xl bg-[#E6CC8A] px-6 py-4 text-base font-semibold text-[#10241A] shadow-[0_10px_30px_-10px_rgba(230,204,138,.5)] hover:-translate-y-0.5 hover:bg-[#EDD79E]">
                Start with the course <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/newcomers" className="btn rounded-xl border border-paper/25 px-6 py-4 text-base text-paper hover:bg-white/5">For newcomers</Link>
            </div>
            <ul className="mt-9 flex animate-rise flex-wrap gap-x-6 [animation-delay:480ms] gap-y-2 text-sm text-[#9FB2A6]">
              <li className="inline-flex items-center gap-2"><Tick />Modules 0 and 1 free</li>
              <li className="inline-flex items-center gap-2"><Tick />No card needed</li>
              <li className="inline-flex items-center gap-2"><Tick />Built on public Canadian sources</li>
            </ul>
          </div>

          {/* Product composite (illustrative) */}
          <div className="relative animate-rise py-8 [animation-delay:300ms]">
            <p className="sr-only">Preview of the NextOwner dashboard: the next lesson, a calculator result and a Deal Team list.</p>
            <div aria-hidden="true" className="relative text-ink">
              <div className="overflow-hidden rounded-[18px] bg-paper-card shadow-[0_0_0_1px_rgba(255,255,255,.06),0_50px_100px_-30px_rgba(0,0,0,.7)]">
                <div className="flex items-center gap-1.5 border-b border-line bg-[#EFE8DA] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D9A28E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E6CC8A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#9DB8A5]" />
                  <span className="ml-3.5 text-xs text-ink-soft">NextOwner · Dashboard</span>
                </div>
                <div className="flex">
                  <div className="hidden w-14 flex-col items-center gap-5 bg-[#10241A] py-5 sm:flex">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6CC8A]/20"><Home size={16} className="text-[#E6CC8A]" /></span>
                    <BookMarked size={16} className="text-[#7FA08A]" /><Users size={16} className="text-[#7FA08A]" /><Calculator size={16} className="text-[#7FA08A]" />
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-3 p-5">
                    <div className="col-span-2 flex items-center justify-between">
                      <div><p className="text-xs text-ink-soft">Good evening</p><p className="font-serif text-2xl tracking-tight">Your acquisition plan</p></div>
                      <span className="rounded-full bg-[#DCE7DF] px-2.5 py-1 text-[11px] font-semibold text-cedar-700">Phase 2 · Find</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-4 rounded-[14px] border border-[#E8E0D0] bg-white p-4">
                      <svg width="56" height="56" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="#EDE5D4" strokeWidth="4" /><circle cx="18" cy="18" r="15" fill="none" stroke="#1F3D2E" strokeWidth="4" strokeDasharray="15 94.2" strokeLinecap="round" transform="rotate(-90 18 18)" className="animate-draw" /></svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Next lesson · Module 2</p>
                        <p className="truncate text-[15px] font-semibold">Building a list and writing to owners</p>
                        <p className="text-[12.5px] text-ink-soft">4 of {lessons} lessons complete</p>
                      </div>
                      <span className="hidden rounded-[9px] bg-cedar-700 px-3 py-2 text-[12.5px] font-semibold text-paper sm:inline">Continue</span>
                    </div>
                    <div className="rounded-[14px] bg-[#10241A] p-4 text-paper">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9FB2A6]">Coverage</p>
                      <p className="mt-1.5 font-serif text-[34px] leading-none">{ex.debtServiceCoverage!.toFixed(2)}×</p>
                      <div className="mt-3 flex h-8 items-end gap-1">
                        {[40, 55, 48, 72, 100].map((h, i) => <span key={i} className="flex-1 origin-bottom animate-grow rounded-sm bg-[#E6CC8A]" style={{ height: `${h}%`, opacity: 0.35 + i * 0.16, animationDelay: `${700 + i * 110}ms` }} />)}
                      </div>
                      <p className="mt-2 text-[11.5px] text-[#9FB2A6]">Example · {formatCad(example.purchasePrice)} price</p>
                    </div>
                    <div className="rounded-[14px] border border-[#E8E0D0] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Deal Team</p>
                      <ul className="mt-2.5 space-y-2 text-[13px]">
                        {[["LW", "Lawyer", "Engaged", "bg-cedar-700 text-paper", "bg-[#DCE7DF]"], ["CP", "CPA", "Talking", "bg-brass-100 text-[#5C4410]", "bg-brass-100"], ["LN", "Lender", "To contact", "bg-paper-deep text-ink-soft", "bg-paper-deep"]].map(([i, r, s, c, a]) => (
                          <li key={r} className="flex items-center gap-2">
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${a}`}>{i}</span>
                            <span className="flex-1">{r}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold ${c}`}>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-12 -left-4 flex w-[262px] animate-float items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 shadow-[0_24px_50px_-18px_rgba(0,0,0,.55)] sm:-left-9">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#DCE7DF]"><Check size={18} strokeWidth={2.4} className="text-cedar-700" /></span>
                <div><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Practical output</p><p className="text-sm font-semibold">One-page thesis complete</p></div>
              </div>
              <div className="absolute -right-2 -top-6 animate-float rounded-[14px] bg-white px-4 py-3 shadow-[0_24px_50px_-18px_rgba(0,0,0,.55)] [animation-delay:-3.5s] sm:-right-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Module 1 quiz</p>
                <p className="font-serif text-[22px]">4 of 4 correct</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FACT BAR */}
      <section aria-label="At a glance" className="container-page relative">
        <ul className="relative -mt-16 grid grid-cols-2 overflow-hidden rounded-[20px] border border-line bg-paper-card shadow-[0_30px_60px_-30px_rgba(16,36,26,.35)] lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal as="li" delay={i * 90} key={f.l} className={`p-7 sm:px-8 ${i % 2 === 0 ? "border-r border-line" : ""} ${i < 2 ? "border-b border-line lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}>
              <p className="font-serif text-5xl font-[350] leading-none text-[#10241A]"><CountUp to={f.v} /></p>
              <p className="mt-2.5 text-[14.5px] text-ink-soft">{f.l}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* SOURCES */}
      <section aria-labelledby="sources-h" className="container-page pt-16">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 id="sources-h" className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Readings link to public sources such as</h2>
          <ul className="flex flex-wrap gap-x-10 gap-y-3 font-serif text-xl text-[#3C4A42]">
            {["BDC", "CSBFP", "FCAC", "Repreneuriat Québec", "Futurpreneur"].map((s) => <li key={s} className="transition-colors hover:text-cedar-700">{s}</li>)}
          </ul>
        </Reveal>
      </section>

      {/* COURSE PHASES */}
      <section aria-labelledby="course-h" className="container-page pt-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[680px]">
            <p className="eyebrow">The course</p>
            <h2 id="course-h" className="mt-4 font-serif text-[40px] font-[350] leading-[1.02] tracking-[-0.025em] sm:text-[58px]">Twelve modules, in the order a deal actually happens.</h2>
          </div>
          <p className="max-w-[360px] text-[16.5px] text-ink-soft">Each module has lessons, readings, a quiz and one practical output you keep.</p>
        </Reveal>
        <Reveal delay={120}><PhaseTabs phases={phases} /></Reveal>
      </section>

      {/* FEATURE ROWS */}
      <section aria-label="Features" className="container-page flex flex-col gap-28 pt-36">
        {/* Lessons */}
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Lessons</p>
            <h3 className="mt-4 font-serif text-[36px] font-[350] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">Plain language, Canadian context, sources you can check.</h3>
            <p className="mt-5 text-[17px] text-ink-soft">Every lesson is written for someone who has never bought a business. Readings are public, linked and labelled free or paid. Your progress and quiz results save as you go.</p>
            <ul className="mt-7 space-y-3 text-[15.5px]">
              {["Continue exactly where you left off", "A quiz with explanations in every module", "Video lessons as they're recorded"].map((t) => (
                <li key={t} className="flex gap-3"><Check size={20} className="mt-0.5 shrink-0 text-cedar-700" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} className="rounded-3xl bg-paper-deep p-6 sm:p-8">
            <div aria-hidden="true">
            <div className="rounded-2xl bg-white p-7 shadow-[0_24px_48px_-28px_rgba(16,36,26,.4)]">
              <p className="text-xs text-ink-soft">Module 5 · Lesson 1 of 2 · 14 min read</p>
              <p className="mt-2 font-serif text-[30px] tracking-tight">Multiples: the common shortcut</p>
              <p className="mt-4 text-[15px] text-[#33403A]">Most small businesses are priced as a multiple of earnings. If adjusted SDE is $400,000 and the multiple is 3, the indicated value is $1.2 million.</p>
              <div className="mt-4 space-y-2"><span className="block h-2 w-full rounded bg-[#F0EBE0]" /><span className="block h-2 w-[92%] rounded bg-[#F0EBE0]" /><span className="block h-2 w-[70%] rounded bg-[#F0EBE0]" /></div>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-paper-deep pt-4">
                <span className="text-[13.5px] text-ink-soft">Finished reading?</span>
                <span className="rounded-[10px] bg-cedar-700 px-4 py-2.5 text-[13.5px] font-semibold text-paper">Mark lesson complete</span>
              </div>
            </div>
            </div>
          </Reveal>
        </div>

        {/* Deal team */}
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal delay={150} className="order-2 rounded-3xl bg-[#10241A] p-6 sm:p-8 lg:order-1">
            <div aria-hidden="true">
            <div className="rounded-2xl bg-paper-card p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-serif text-[28px]">Lawyer</p>
                <span className="rounded-full bg-cedar-700 px-2.5 py-1 text-xs font-semibold text-paper">On your team · Engaged</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5 text-sm">
                <div><p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-cedar-700">What they do</p><p className="mt-1.5 text-[#33403A]">Review the LOI and purchase agreement, lead legal due diligence, coordinate closing.</p></div>
                <div><p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-clay-700">What they don&apos;t</p><p className="mt-1.5 text-[#33403A]">Decide whether the business is a good investment.</p></div>
              </div>
              <div className="mt-5 rounded-xl bg-paper px-4 py-3.5">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Ask them</p>
                <p className="mt-1.5 text-sm">“Which parts of the LOI will be binding?”</p>
              </div>
            </div>
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <p className="eyebrow">Deal Team</p>
            <h3 className="mt-4 font-serif text-[36px] font-[350] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">Know who does what, and what to ask them.</h3>
            <p className="mt-5 text-[17px] text-ink-soft">Brokers, lawyers, accountants, lenders, valuators, insurance advisors and mentors. Keep a private list of who you&apos;re talking to. NextOwner never contacts anyone for you.</p>
            <Link href="/deal-team" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-cedar-700 hover:underline">Explore the roles <ArrowRight size={16} aria-hidden="true" /></Link>
          </Reveal>
        </div>

        {/* Calculator */}
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Tools</p>
            <h3 className="mt-4 font-serif text-[36px] font-[350] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">Test a price before you make an offer.</h3>
            <p className="mt-5 text-[17px] text-ink-soft">Enter the price, your equity and any seller financing. See the monthly payments, how well cash flow covers the debt and what&apos;s left for you. Save every scenario.</p>
            <Link href="/tools/affordability" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-cedar-700 hover:underline">Open the calculator <ArrowRight size={16} aria-hidden="true" /></Link>
          </Reveal>
          <Reveal delay={150} className="rounded-3xl bg-paper-deep p-6 sm:p-8">
            <div aria-hidden="true" className="grid gap-3.5 sm:grid-cols-2">
              <div className="space-y-3 rounded-2xl bg-white p-5 text-[13.5px]">
                {[["Purchase price", example.purchasePrice], ["Down payment", example.downPayment], ["Seller financing", example.sellerFinancing]].map(([k, v]) => (
                  <div key={k as string}><p className="text-ink-soft">{k}</p><p className="mt-0.5 rounded-lg border border-line px-2.5 py-1.5 text-base font-semibold">{formatCad(v as number)}</p></div>
                ))}
              </div>
              <div className="flex flex-col justify-between gap-3 rounded-2xl bg-[#10241A] p-5 text-paper">
                <div><p className="text-[12.5px] text-[#9FB2A6]">Monthly debt service</p><p className="font-serif text-[26px]">{formatCad(ex.monthlyDebtService)}</p></div>
                <div><p className="text-[12.5px] text-[#9FB2A6]">Coverage</p><p className="font-serif text-[40px] leading-tight text-[#E6CC8A]"><CountUp to={ex.debtServiceCoverage!} decimals={2} suffix="×" /></p></div>
                <div><p className="text-[12.5px] text-[#9FB2A6]">Your take-home</p><p className="font-serif text-[22px]">{formatCad(ex.buyerTakeHomeMonthly)} / mo</p></div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-soft">{exampleNote}</p>
          </Reveal>
        </div>
      </section>

      {/* NEWCOMERS */}
      <section aria-labelledby="newcomers-h" className="container-page pt-36">
        <Reveal className="grid overflow-hidden rounded-[28px] border border-line bg-paper-card lg:grid-cols-2">
          <div className="p-9 sm:p-14">
            <p className="eyebrow text-clay-700">For newcomers</p>
            <h2 id="newcomers-h" className="mt-4 font-serif text-[36px] font-[350] leading-[1.04] tracking-[-0.02em] sm:text-[48px]">New to Canada? The same course, with an extra pathway.</h2>
            <p className="mt-5 text-[17px] text-ink-soft">Your experience from elsewhere is an asset. Six short supplements cover the extra steps, and each links into the modules where it matters. Support, never a penalty.</p>
            <Link href="/newcomers" className="btn mt-7 rounded-xl bg-clay-700 px-5 py-3.5 font-semibold text-paper-card hover:bg-[#743418]">See the newcomer pathway <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ol className="flex flex-col justify-center bg-[#10241A] px-9 py-8 text-paper sm:px-12">
            {sups.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/newcomers/${s.slug}`} className={`group flex items-baseline gap-5 py-4 ${i < sups.length - 1 ? "border-b border-paper/10" : ""}`}>
                  <span className="w-7 font-serif text-[#E6CC8A]">{s.code}</span>
                  <span className="flex-1 group-hover:underline">{s.title}</span>
                  <ArrowRight size={16} className="text-[#7FA08A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* PRINCIPLES */}
      <section aria-labelledby="principles-h" className="container-page pt-36">
        <h2 id="principles-h" className="font-serif text-[36px] font-[350] leading-[1.05] tracking-[-0.02em] sm:text-[46px]">How we built it.</h2>
        <div className="mt-11 grid gap-10 border-t border-ink pt-9 md:grid-cols-3">
          {[
            { i: NotebookText, t: "Public sources, cited", d: "Readings link to government programs, BDC guides and published research, each labelled free or paid." },
            { i: Lock, t: "Your work stays yours", d: "Your team list, scenarios and progress are private. No public directory, and no messages sent for you." },
            { i: Globe2, t: "Made for every buyer", d: "One course for everyone, with extra support for newcomers that is never a penalty or a score." },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 120}>
              <p.i size={26} strokeWidth={1.8} className="text-cedar-700" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-2xl font-normal">{p.t}</h3>
              <p className="mt-2.5 text-[15.5px] text-ink-soft">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-h" className="container-page pt-36">
        <Reveal className="grid gap-14 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="faq-h" className="font-serif text-[36px] font-[350] leading-[1.05] tracking-[-0.02em] sm:text-[46px]">Questions</h2>
            <p className="mt-3.5 text-ink-soft">Short answers to what people ask first.</p>
          </div>
          <div className="border-t border-ink">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus size={20} aria-hidden="true" className="shrink-0 text-cedar-700 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="mt-3 animate-fadein text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-page pt-36">
        <Reveal className="relative flex flex-wrap items-center justify-between gap-9 overflow-hidden rounded-[28px] bg-[#10241A] px-8 py-16 text-paper sm:px-16 sm:py-20">
          <div aria-hidden="true" className="absolute -right-32 -top-40 h-[520px] w-[520px] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(201,167,90,.25),rgba(201,167,90,0))]" />
          <div className="relative max-w-2xl">
            <h2 className="font-serif text-[40px] font-[350] leading-[1.02] tracking-[-0.025em] text-paper sm:text-[58px]">Start free with Modules 0 and 1.</h2>
            <p className="mt-4 text-lg text-[#B9C8BE]">Decide whether buying fits your life, then write the thesis that will guide your search.</p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Link href="/sign-up?next=/course" className="btn rounded-xl bg-[#E6CC8A] px-6 py-4 font-semibold text-[#10241A] hover:bg-[#EDD79E]">Create free account</Link>
            <Link href="/pricing" className="btn rounded-xl border border-paper/25 px-6 py-4 text-paper hover:bg-white/5">See pricing</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
