import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getChecklist as getSavedChecklist, getCompletedLessons, getNewsPrefs, getQuizResults, getReadNews, listScenarios, listTeam } from "@/lib/repo";
import { formatNewsDate, getNews, unreadItems } from "@/lib/news";
import { getChecklist, getModules, getRoles, getSupplements, moduleProgress } from "@/lib/content";
import { continueLesson } from "@/lib/progress";
import { calculate, formatCad } from "@/lib/calculator";
import { ProgressBar } from "@/components/ProgressBar";
import { ModulePath } from "@/components/ModulePath";
import { setNewcomerTrackAction } from "@/app/actions/learning";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { not_contacted: "Not contacted", talking: "Talking", engaged: "Engaged" };

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const db = getDb();
  const modules = getModules();
  const completed = getCompletedLessons(db, user.id);
  const quizzes = getQuizResults(db, user.id);
  const team = listTeam(db, user.id);
  const scenarios = listScenarios(db, user.id);
  const checked = getSavedChecklist(db, user.id);
  const checklistTotal = getChecklist().reduce((n, g) => n + g.items.length, 0);
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const next = continueLesson(user.lastModule, user.lastLesson, completed);
  const doneModules = new Set(modules.filter((m) => { const p = moduleProgress(m, completed); return p.done === p.total; }).map((m) => m.slug));
  const news = getNews();
  const newsUnread = unreadItems(news, getReadNews(db, user.id), getNewsPrefs(db, user.id), user.createdAt);
  const newsShown = (newsUnread.length > 0 ? newsUnread : news).slice(0, 3);
  const roleTitle = (s: string) => getRoles().find((r) => r.slug === s)?.title ?? s;

  return (
    <>
    <div className="relative overflow-hidden bg-cedar-900 text-paper">
      <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass-500/25 blur-[100px]" />
      <header className="container-page relative flex flex-wrap items-end justify-between gap-6 pb-24 pt-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cedar-100">Dashboard</p>
          <h1 className="mt-2 text-5xl text-paper">Hello, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-paper/70">{completed.size} of {totalLessons} lessons done · {checked.size} checklist {checked.size === 1 ? "item" : "items"} · {team.length} {team.length === 1 ? "person" : "people"} on your team</p>
        </div>
        {next && (
          <Link href={`/course/${next.module.slug}/${next.lesson.slug}`} className="btn-light px-6 py-3">
            Continue where you left off
          </Link>
        )}
      </header>
    </div>
    <div className="container-page">
      <div className="relative -mt-14 grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="progress-h" className="card p-7 lg:col-span-2">
          <h2 id="progress-h" className="text-2xl">Course progress</h2>
          <div className="mt-4"><ProgressBar done={completed.size} total={totalLessons} label="Lessons completed" /></div>
          {next ? (
            <p className="mt-4 text-[15px]">Next lesson: <Link className="link" href={`/course/${next.module.slug}/${next.lesson.slug}`}>Module {next.module.number}, {next.lesson.title}</Link></p>
          ) : (
            <p className="mt-4 text-[15px] text-cedar-700">Every lesson is complete.</p>
          )}
          <div className="mt-8"><ModulePath modules={modules} completedModules={doneModules} compact /></div>
          {quizzes.size > 0 && (
            <div className="mt-8">
              <h3 className="text-lg">Saved quiz results</h3>
              <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                {modules.filter((m) => quizzes.has(m.slug)).map((m) => {
                  const q = quizzes.get(m.slug)!;
                  return <li key={m.slug}><Link className="link" href={`/course/${m.slug}#quiz`}>Module {m.number}</Link>: {q.correct} of {q.total} correct</li>;
                })}
              </ul>
            </div>
          )}
        </section>

        <section aria-labelledby="check-h" className="card p-7">
          <h2 id="check-h" className="text-2xl">Checklist</h2>
          <p className="mt-3 font-serif text-4xl text-cedar-900">{checked.size} <span className="text-lg text-ink-soft">of {checklistTotal} done</span></p>
          <Link className="link mt-4 inline-block text-[15px]" href="/tools/checklist">Open checklist</Link>
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-lg">Newcomer track</h3>
            <p className="mt-1 text-sm text-ink-soft">{user.newcomerTrack ? "On. Newcomer supplements are highlighted in your modules." : "Off. Anyone can still read the supplements."}</p>
            <form action={setNewcomerTrackAction} className="mt-3">
              <input type="hidden" name="on" value={user.newcomerTrack ? "0" : "1"} />
              <button className="btn-quiet text-sm" aria-pressed={user.newcomerTrack}>{user.newcomerTrack ? "Turn off" : "Turn on"}</button>
            </form>
            {user.newcomerTrack && (
              <ul className="mt-3 space-y-1 text-sm">
                {getSupplements().map((s) => <li key={s.slug}><Link className="link" href={`/newcomers/${s.slug}`}>{s.code}: {s.title}</Link></li>)}
              </ul>
            )}
          </div>
        </section>

        <section aria-labelledby="team-h" className="card p-7 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 id="team-h" className="text-2xl">My Deal Team</h2>
            <Link className="link text-[15px]" href="/deal-team#my-team">Manage</Link>
          </div>
          {team.length === 0 ? (
            <p className="mt-3 text-ink-soft">No one yet. <Link className="link" href="/deal-team">Learn about each role</Link> and start your list.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {team.map((t) => (
                <li key={t.id} className="flex flex-wrap justify-between gap-2 py-3 text-[15px]">
                  <span><strong className="font-medium">{t.name}</strong>{t.firm && `, ${t.firm}`} <span className="text-ink-soft">· {roleTitle(t.role)}</span></span>
                  <span className="text-sm text-ink-soft">{STATUS[t.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="sc-h" className="card p-7">
          <div className="flex items-center justify-between">
            <h2 id="sc-h" className="text-2xl">Scenarios</h2>
            <Link className="link text-[15px]" href="/tools/affordability">Calculator</Link>
          </div>
          {scenarios.length === 0 ? (
            <p className="mt-3 text-ink-soft">No saved scenarios yet.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-[15px]">
              {scenarios.slice(0, 5).map((s) => {
                const r = calculate(s.inputs);
                return (
                  <li key={s.id}>
                    <span className="font-medium">{s.name}</span>
                    <span className="block text-sm text-ink-soft">{formatCad(s.inputs.purchasePrice)} · coverage {r.debtServiceCoverage === null ? "n/a" : `${r.debtServiceCoverage.toFixed(2)}×`}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        <section aria-labelledby="news-h" className="card p-7 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 id="news-h" className="text-2xl">News {newsUnread.length > 0 && <span className="tag ml-2 bg-clay-700 align-middle text-paper">{newsUnread.length} new</span>}</h2>
            <Link className="link text-[15px]" href="/news">All news</Link>
          </div>
          {newsShown.length === 0 ? (
            <p className="mt-3 text-ink-soft">No updates yet.</p>
          ) : (
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {newsShown.map((n) => (
                <li key={n.id} className="rounded-xl border border-line p-4">
                  <p className="text-xs text-ink-soft">{formatNewsDate(n.date)} · {n.source}</p>
                  <Link href={`/news/${n.id}`} className="mt-1 block font-medium leading-snug hover:text-cedar-700">{n.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
    </>
  );
}
