import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getModule, getModules, getSupplements, moduleProgress } from "@/lib/content";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCompletedLessons, getQuizResults } from "@/lib/repo";
import { ReviewNotice } from "@/components/ReviewNotice";
import { VideoSlot } from "@/components/VideoSlot";
import { Quiz } from "@/components/Quiz";
import { ProgressBar } from "@/components/ProgressBar";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const m = getModule((await params).module);
  return { title: m ? `Module ${m.number}: ${m.title}` : "Module" };
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const m = getModule((await params).module);
  if (!m) notFound();
  const user = await currentUser();
  const db = getDb();
  const completed = user ? getCompletedLessons(db, user.id) : new Set<string>();
  const quiz = user ? getQuizResults(db, user.id).get(m.slug) ?? null : null;
  const progress = moduleProgress(m, completed);
  const supplements = getSupplements().filter((s) => m.newcomerSupplements.includes(s.slug));
  const modules = getModules();
  const prev = modules.find((x) => x.number === m.number - 1);
  const next = modules.find((x) => x.number === m.number + 1);
  const toolHref = m.relatedTool.status === "working" ? `/tools/${m.relatedTool.slug}` : "/tools#planned";

  return (
    <article>
      <div className="relative overflow-hidden border-b border-line/70 bg-gradient-to-b from-cedar-50 to-paper">
      <div aria-hidden="true" className="bg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-page relative pb-14 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link href="/course" className="hover:text-cedar-700">Course</Link> <span aria-hidden="true">/</span> Module {m.number}
      </nav>
      <header className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill">Module {m.number} · {m.phase}</span>
            {m.freePreview && <span className="tag bg-cedar-100 text-cedar-900">Free preview</span>}
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl">{m.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{m.summary}</p>
          {m.reviewNotice && <div className="mt-6"><ReviewNotice /></div>}
        </div>
        <div className="card self-start p-6">
          {user ? <ProgressBar done={progress.done} total={progress.total} label="Lessons in this module" /> : <p className="text-sm text-ink-soft"><Link className="link" href={`/sign-in?next=/course/${m.slug}`}>Sign in</Link> to track your progress.</p>}
          <Link href={`/course/${m.slug}/${m.lessons.find((l) => !completed.has(`${m.slug}/${l.slug}`))?.slug ?? m.lessons[0].slug}`} className="btn-primary mt-5 w-full">
            {progress.done === 0 ? "Start the first lesson" : progress.done === progress.total ? "Review the lessons" : "Continue this module"}
          </Link>
        </div>
      </header>
      </div>
      </div>
      <div className="container-page">
      <div className="mt-14 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-14">
          <section aria-labelledby="outcomes">
            <h2 id="outcomes" className="text-2xl">Learning outcomes</h2>
            <ul className="mt-4 space-y-2">
              {m.outcomes.map((o) => (
                <li key={o} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cedar-500" />{o}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="video"><h2 id="video" className="sr-only">Module video</h2><VideoSlot video={m.video} title={m.title} /></section>

          <section aria-labelledby="lessons">
            <h2 id="lessons" className="text-2xl">Lessons</h2>
            <ol className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper-card">
              {m.lessons.map((l, i) => {
                const done = completed.has(`${m.slug}/${l.slug}`);
                return (
                  <li key={l.slug}>
                    <Link href={`/course/${m.slug}/${l.slug}`} className="flex items-center gap-4 px-5 py-4 hover:bg-paper">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${done ? "border-cedar-700 bg-cedar-700 text-paper" : "border-line"}`}>{done ? "✓" : i + 1}</span>
                      <span className="flex-1">{l.title}</span>
                      <span className="text-sm text-ink-soft">{l.minutes} min{done && <span className="sr-only">, completed</span>}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="output" className="relative overflow-hidden rounded-3xl bg-cedar-900 p-8 text-paper shadow-lift sm:p-10">
            <p className="eyebrow text-cedar-100">Practical output</p>
            <h2 id="output" className="mt-2 text-3xl text-paper">{m.practicalOutput.title}</h2>
            <p className="mt-3 text-paper/80">{m.practicalOutput.description}</p>
            <ol className="mt-5 list-decimal space-y-2 pl-5 marker:text-cedar-300">
              {m.practicalOutput.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>

          <section aria-labelledby="quiz">
            <h2 id="quiz" className="text-2xl">Check your understanding</h2>
            <div className="mt-5"><Quiz moduleSlug={m.slug} questions={m.quiz} previous={quiz} signedIn={Boolean(user)} /></div>
          </section>
        </div>

        <aside className="space-y-10">
          <section aria-labelledby="readings">
            <h2 id="readings" className="text-2xl">Readings</h2>
            <ul className="mt-4 space-y-4">
              {m.readings.map((r) => (
                <li key={r.url} className="card p-5">
                  <div className="flex items-center gap-2">
                    <span className={`tag ${r.access === "FREE" ? "bg-cedar-100 text-cedar-900" : "bg-clay-100 text-clay-700"}`}>{r.access}</span>
                    <span className="text-xs text-ink-soft">{r.source}</span>
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="link mt-2 block font-medium">{r.title}<span className="sr-only"> (opens in a new tab)</span></a>
                  <p className="mt-1 text-sm text-ink-soft">{r.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tool" className="card p-6">
            <h2 id="tool" className="text-xl">Related tool</h2>
            <Link href={toolHref} className="link mt-2 inline-block">{m.relatedTool.label}</Link>
          </section>

          {supplements.length > 0 && (
            <section aria-labelledby="newcomer" className={`rounded-2xl border p-6 ${user?.newcomerTrack ? "border-clay-500/50 bg-clay-100/50" : "border-line"}`}>
              <h2 id="newcomer" className="text-xl">For newcomers</h2>
              <p className="mt-1 text-sm text-ink-soft">Supplements that go with this module.</p>
              <ul className="mt-3 space-y-2">
                {supplements.map((s) => (
                  <li key={s.slug}><Link className="link" href={`/newcomers/${s.slug}`}>{s.code}: {s.title}</Link></li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      <nav aria-label="Module navigation" className="mt-16 flex justify-between gap-4 border-t border-line pt-6 text-[15px]">
        {prev ? <Link className="link" href={`/course/${prev.slug}`}>← Module {prev.number}: {prev.title}</Link> : <span />}
        {next ? <Link className="link text-right" href={`/course/${next.slug}`}>Module {next.number}: {next.title} →</Link> : <span />}
      </nav>
      </div>
    </article>
  );
}
