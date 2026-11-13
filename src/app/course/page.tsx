import Link from "next/link";
import type { Metadata } from "next";
import { getModules, moduleProgress } from "@/lib/content";
import { continueLesson } from "@/lib/progress";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCompletedLessons } from "@/lib/repo";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = { title: "Course" };
export const dynamic = "force-dynamic";

export default async function CoursePage() {
  const modules = getModules();
  const user = await currentUser();
  const completed = user ? getCompletedLessons(getDb(), user.id) : new Set<string>();
  const next = user ? continueLesson(user.lastModule, user.lastLesson, completed) : null;
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="container-page pt-14">
      <header className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">Course</p>
          <h1 className="mt-3 text-5xl">The ETA roadmap</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Twelve modules that follow a real acquisition, in order. Each has written lessons, a video slot, readings from public sources, a practical output and a short quiz.
          </p>
        </div>
        <div className="card p-6">
          {user ? (
            <>
              <ProgressBar done={completed.size} total={totalLessons} label="Lessons completed" />
              {next ? (
                <Link href={`/course/${next.module.slug}/${next.lesson.slug}`} className="btn-primary mt-5 w-full">
                  Continue where you left off
                </Link>
              ) : (
                <p className="mt-4 text-sm text-cedar-700">You have completed every lesson.</p>
              )}
            </>
          ) : (
            <>
              <p className="text-[15px] text-ink-soft">Create a free account to save your progress and quiz results.</p>
              <Link href="/sign-up?next=/course" className="btn-primary mt-4 w-full">Create account</Link>
            </>
          )}
        </div>
      </header>

      <ol className="mt-14 divide-y divide-line border-y border-line">
        {modules.map((m) => {
          const p = moduleProgress(m, completed);
          return (
            <li key={m.slug}>
              <Link href={`/course/${m.slug}`} className="group grid gap-4 py-7 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                <span className="font-serif text-5xl leading-none text-cedar-300 group-hover:text-cedar-700" aria-hidden="true">{m.number}</span>
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow text-[11px] text-ink-soft">{m.phase}</span>
                    {m.freePreview && <span className="tag bg-cedar-100 text-cedar-900">Free preview</span>}
                  </span>
                  <span className="mt-1 block font-serif text-2xl text-cedar-900 group-hover:text-cedar-700">
                    <span className="sr-only">Module {m.number}: </span>{m.title}
                  </span>
                  <span className="mt-1 block max-w-2xl text-[15px] text-ink-soft">{m.summary}</span>
                  <span className="mt-2 block text-sm text-ink-soft">Practical output: <strong className="font-medium text-ink">{m.practicalOutput.title}</strong></span>
                </span>
                <span className="text-sm text-ink-soft sm:text-right">
                  {user ? `${p.done}/${p.total} lessons` : `${p.total} lessons`}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
