import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CheckCircle2, Globe2, Plus, Users, Video, ListChecks, Sparkles } from "lucide-react";
import { getModules, getRoles, getSupplements } from "@/lib/content";
import { ModulePath } from "@/components/ModulePath";
import { HeroPreview } from "@/components/HeroPreview";

const SOURCES = ["BDC", "Canada Small Business Financing Program", "FCAC", "Repreneuriat Québec", "Futurpreneur", "Stanford GSB search fund research"];

const FAQ = [
  { q: "Who is NextOwner for?", a: "Anyone in Canada who is seriously considering buying an existing small business, whether you are early in the idea or already looking at listings." },
  { q: "Do I need to be a newcomer to use it?", a: "No. The course is for every buyer. Newcomers get six extra supplements that sit beside the same modules, and anyone can read them." },
  { q: "Does NextOwner find businesses or contact sellers for me?", a: "No. NextOwner teaches the process and gives you tools to practise it. It has no listings or public directory, and it never sends messages on your behalf." },
  { q: "What does it cost?", a: "Modules 0 and 1, the Deal Team guide, the tools and the newcomer supplements are free. A paid package is planned, and its contents are still being decided." },
  { q: "Where do the readings come from?", a: "Each module links to public sources, mostly Canadian, such as BDC guides and federal program pages. Every reading is labelled FREE or PAID." },
  { q: "Is there a French version?", a: "A French landing page exists as a draft. The full course is in English for now." },
];

export default function HomePage() {
  const modules = getModules();
  const lessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const questions = modules.reduce((n, m) => n + m.quiz.length, 0);
  const roles = getRoles();
  const sups = getSupplements();

  const stats = [
    { v: modules.length, l: "modules, from decision to day 100" },
    { v: lessons, l: "written lessons" },
    { v: questions, l: "quiz questions with explanations" },
    { v: roles.length, l: "Deal Team roles explained" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-cedar-900 text-paper">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_75%)]" />
        <div aria-hidden="true" className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-cedar-500/40 blur-[120px]" />
        <div aria-hidden="true" className="absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-brass-500/25 blur-[120px]" />
        <div className="container-page relative grid gap-16 pb-28 pt-20 sm:pt-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cedar-100 backdrop-blur">
              <Sparkles size={13} aria-hidden="true" /> Entrepreneurship through acquisition, in Canada
            </span>
            <h1 className="mt-6 text-[44px] leading-[1.02] text-paper sm:text-6xl lg:text-[70px]">
              Prepare to buy a small business in Canada with a <em className="text-gradient font-normal italic">clearer map.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
              Learn the whole path, from your first thesis to your first hundred days. Build the team you need around you, and practise the numbers before real money is on the line.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/course" className="btn-light px-6 py-3 text-base">Start with the course <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href="/newcomers" className="btn-ghost-light px-6 py-3 text-base">For newcomers</Link>
            </div>
            <p className="mt-6 text-sm text-paper/60">New to Canada? There&apos;s an extra pathway for you.</p>
          </div>
          <div className="animate-rise pb-6 pt-8 [animation-delay:150ms] lg:pt-0">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* SOURCES STRIP */}
      <section aria-labelledby="sources-h" className="border-b border-line/70 bg-paper-card">
        <div className="container-page flex flex-col items-center gap-5 py-8 lg:flex-row lg:justify-between">
          <h2 id="sources-h" className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Readings link to public sources such as</h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {SOURCES.map((s) => <li key={s} className="font-serif text-[17px] text-cedar-900/70">{s}</li>)}
          </ul>
        </div>
      </section>

      {/* STATS */}
      <section aria-label="At a glance" className="container-page pt-20">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-soft lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.l} className="bg-paper-card p-7">
              <p className="font-serif text-5xl text-cedar-900">{s.v}</p>
              <p className="mt-2 text-[15px] text-ink-soft">{s.l}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* PATH */}
      <section aria-labelledby="path-heading" className="container-page pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The path</p>
          <h2 id="path-heading" className="mt-4 text-4xl sm:text-5xl">Twelve modules, in the order a deal happens</h2>
          <p className="mt-4 text-lg text-ink-soft">Each module ends with something you produce, from a personal fit statement to a one-page deal pitch.</p>
        </div>
        <div className="mt-14"><ModulePath modules={modules} /></div>
        <div className="mt-10 text-center"><Link href="/course" className="btn-secondary">See every module and lesson <ArrowRight size={16} aria-hidden="true" /></Link></div>
      </section>

      {/* BENTO */}
      <section aria-labelledby="features-h" className="container-page pt-28">
        <div className="max-w-2xl">
          <p className="eyebrow">What you get</p>
          <h2 id="features-h" className="mt-4 text-4xl sm:text-5xl">A course, a team and the tools to practise</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {/* Course */}
          <Link href="/course" className="card card-hover group relative overflow-hidden p-8 lg:col-span-2">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cedar-100 text-cedar-900"><BookOpen size={19} aria-hidden="true" /></span><span className="eyebrow">Course</span></div>
            <h3 className="mt-5 text-3xl">Learn it in the order you&apos;ll do it</h3>
            <p className="mt-3 max-w-lg text-ink-soft">Written lessons, readings, a practical output and a quiz in every module. Progress saves as you go.</p>
            <div aria-hidden="true" className="mt-8 grid gap-3 sm:grid-cols-[1.2fr_1fr]">
              <div className="flex aspect-video flex-col items-center justify-center rounded-2xl bg-cedar-900 text-paper">
                <Video size={26} className="text-cedar-100" />
                <p className="mt-2 font-serif text-lg">Video coming soon</p>
              </div>
              <ul className="min-w-0 space-y-2 text-[13.5px]">
                {modules[5].lessons.concat(modules[6].lessons).slice(0, 4).map((l, i) => (
                  <li key={l.slug} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5">
                    {i < 2 ? <CheckCircle2 size={16} className="text-cedar-500" /> : <span className="h-4 w-4 rounded-full border border-line" />}
                    <span className="truncate">{l.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Link>
          {/* Tools */}
          <Link href="/tools/affordability" className="card card-hover group overflow-hidden p-8">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-100 text-ink"><Calculator size={19} aria-hidden="true" /></span><span className="eyebrow">Tools</span></div>
            <h3 className="mt-5 text-3xl">Test the numbers</h3>
            <p className="mt-3 text-ink-soft">See payments, coverage and what&apos;s left for you each month.</p>
            <dl aria-hidden="true" className="mt-7 space-y-2 rounded-2xl bg-cedar-900 p-5 text-paper">
              {[["Total debt service", "$9,212 / mo"], ["Coverage", "2.71×"], ["Take-home", "$15,787 / mo"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[13.5px]"><dt className="text-paper/70">{k}</dt><dd className="font-serif text-lg">{v}</dd></div>
              ))}
            </dl>
          </Link>
          {/* Deal team */}
          <Link href="/deal-team" className="card card-hover group p-8">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cedar-100 text-cedar-900"><Users size={19} aria-hidden="true" /></span><span className="eyebrow">Deal Team</span></div>
            <h3 className="mt-5 text-3xl">Know who does what</h3>
            <p className="mt-3 text-ink-soft">What each professional does, doesn&apos;t do, and what to ask them.</p>
            <ul aria-hidden="true" className="mt-6 flex flex-wrap gap-2">
              {roles.filter((r) => !r.newcomerOnly).map((r) => <li key={r.slug} className="rounded-full border border-line bg-white px-3 py-1 text-[13px]">{r.title}</li>)}
            </ul>
          </Link>
          {/* Newcomers */}
          <Link href="/newcomers" className="group relative overflow-hidden rounded-2xl border border-clay-500/20 bg-gradient-to-br from-clay-100 via-[#F7E9DD] to-paper-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift lg:col-span-2">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-clay-700 text-paper"><Globe2 size={19} aria-hidden="true" /></span><span className="eyebrow text-clay-700">For newcomers</span></div>
            <h3 className="mt-5 text-3xl">An extra pathway beside the same course</h3>
            <p className="mt-3 max-w-lg text-ink-soft">Support, never a penalty. Six short supplements linked into the modules where they matter.</p>
            <ul aria-hidden="true" className="mt-7 grid gap-2 sm:grid-cols-2">
              {sups.map((s) => (
                <li key={s.slug} className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2.5 text-[13.5px] backdrop-blur">
                  <span className="font-serif text-clay-700">{s.code}</span><span className="truncate">{s.title}</span>
                </li>
              ))}
            </ul>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section aria-labelledby="how-h" className="container-page pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 id="how-h" className="mt-4 text-4xl sm:text-5xl">From curious to deal-ready</h2>
            <p className="mt-4 text-lg text-ink-soft">Work at your own pace. Everything you produce is saved to your dashboard.</p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {[
              { i: BookOpen, t: "Learn", d: "Work through the modules in order, or jump to what you need now." },
              { i: ListChecks, t: "Practise", d: "Produce each module's output and test real numbers in the tools." },
              { i: Users, t: "Assemble", d: "Build your Deal Team list and track who you're talking to." },
            ].map((s, n) => (
              <li key={s.t} className="card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cedar-900 text-cedar-100"><s.i size={18} aria-hidden="true" /></span>
                  <span className="font-serif text-4xl text-cedar-100">0{n + 1}</span>
                </div>
                <h3 className="mt-5 text-2xl">{s.t}</h3>
                <p className="mt-2 text-[15px] text-ink-soft">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-h" className="container-page max-w-3xl pt-28">
        <h2 id="faq-h" className="text-center text-4xl sm:text-5xl">Questions</h2>
        <div className="mt-10 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper-card shadow-soft">
          {FAQ.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium text-ink hover:bg-white/60">
                {f.q}
                <Plus size={18} aria-hidden="true" className="shrink-0 text-cedar-700 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="px-6 pb-6 text-[15.5px] text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pt-28">
        <div className="relative overflow-hidden rounded-3xl bg-cedar-900 px-8 py-16 text-paper shadow-lift sm:px-16">
          <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass-500/30 blur-[100px]" />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="text-4xl text-paper sm:text-5xl">Start free with Modules 0 and 1.</h2>
              <p className="mt-4 max-w-xl text-lg text-paper/75">Work out whether buying fits your life, then write the thesis that will guide your search.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/course/is-buying-right-for-me" className="btn-light px-6 py-3">Begin Module 0 <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href="/pricing" className="btn-ghost-light px-6 py-3">See pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
