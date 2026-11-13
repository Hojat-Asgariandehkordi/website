import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allLessons, getLesson } from "@/lib/content";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCompletedLessons, setLastLesson } from "@/lib/repo";
import { Markdown } from "@/components/Markdown";
import { ReviewNotice } from "@/components/ReviewNotice";
import { VideoSlot } from "@/components/VideoSlot";
import { toggleLessonAction } from "@/app/actions/learning";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ module: string; lesson: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await params;
  const found = getLesson(p.module, p.lesson);
  return { title: found ? found.lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: P) {
  const p = await params;
  const found = getLesson(p.module, p.lesson);
  if (!found) notFound();
  const { module: m, lesson } = found;
  const user = await currentUser();
  let done = false;
  if (user) {
    const db = getDb();
    setLastLesson(db, user.id, m.slug, lesson.slug);
    done = getCompletedLessons(db, user.id).has(`${m.slug}/${lesson.slug}`);
  }
  const flat = allLessons();
  const idx = flat.findIndex((x) => x.key === `${m.slug}/${lesson.slug}`);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const lessonIndex = m.lessons.findIndex((l) => l.slug === lesson.slug);

  return (
    <article className="container-page max-w-3xl pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link href="/course" className="hover:text-cedar-700">Course</Link> <span aria-hidden="true">/</span>{" "}
        <Link href={`/course/${m.slug}`} className="hover:text-cedar-700">Module {m.number}: {m.title}</Link>
      </nav>
      <p className="eyebrow mt-8">Lesson {lessonIndex + 1} of {m.lessons.length} · {lesson.minutes} min read</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">{lesson.title}</h1>
      {m.reviewNotice && <div className="mt-6"><ReviewNotice /></div>}
      <div className="mt-8"><VideoSlot video={lesson.video} title={lesson.title} /></div>
      <div className="mt-10"><Markdown source={lesson.body} /></div>

      <div className="mt-12 rounded-2xl border border-line bg-paper-card p-6">
        {user ? (
          <form action={toggleLessonAction} className="flex flex-wrap items-center justify-between gap-4">
            <input type="hidden" name="module" value={m.slug} />
            <input type="hidden" name="lesson" value={lesson.slug} />
            <input type="hidden" name="complete" value={done ? "0" : "1"} />
            <p className="text-[15px]">{done ? "You've completed this lesson." : "Finished reading?"}</p>
            <button className={done ? "btn-secondary" : "btn-primary"}>{done ? "Mark as not complete" : "Mark lesson complete"}</button>
          </form>
        ) : (
          <p className="text-[15px]"><Link className="link" href={`/sign-in?next=/course/${m.slug}/${lesson.slug}`}>Sign in</Link> to save your progress.</p>
        )}
      </div>

      <nav aria-label="Lesson navigation" className="mt-10 grid gap-4 border-t border-line pt-6 text-[15px] sm:grid-cols-2">
        {prev ? <Link className="link" href={`/course/${prev.module.slug}/${prev.lesson.slug}`}>← {prev.lesson.title}</Link> : <span />}
        {next ? <Link className="link sm:text-right" href={`/course/${next.module.slug}/${next.lesson.slug}`}>{next.lesson.title} →</Link> : <Link className="link sm:text-right" href={`/course/${m.slug}#quiz`}>Take the module quiz →</Link>}
      </nav>
      {lessonIndex === m.lessons.length - 1 && next && (
        <p className="mt-4 text-sm text-ink-soft">Before moving on, try the <Link className="link" href={`/course/${m.slug}#quiz`}>Module {m.number} quiz</Link> and the practical output.</p>
      )}
    </article>
  );
}
