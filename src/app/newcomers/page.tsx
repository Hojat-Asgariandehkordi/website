import Link from "next/link";
import type { Metadata } from "next";
import { getModules, getSupplements } from "@/lib/content";
import { currentUser } from "@/lib/auth";
import { setNewcomerTrackAction } from "@/app/actions/learning";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "For newcomers" };
export const dynamic = "force-dynamic";

export default async function NewcomersPage() {
  const sups = getSupplements();
  const modules = getModules();
  const user = await currentUser();
  const titleOf = (slug: string) => {
    const m = modules.find((x) => x.slug === slug);
    return m ? `Module ${m.number}` : slug;
  };
  return (
    <>
      <PageHeader tone="clay" eyebrow="For newcomers" title="The same course, with a pathway for newcomers to Canada" intro="Your experience from elsewhere is an asset. These six supplements cover the extra steps newcomers often face, and each links into the matching course modules. Anyone can read them.">
        <div className="card p-6">
          <p className="font-medium">Newcomer track</p>
          <p className="mt-1 text-sm text-ink-soft">Turn it on to highlight these supplements in your course and dashboard. It is support only and is never part of any score.</p>
          {user ? (
            <form action={setNewcomerTrackAction} className="mt-4">
              <input type="hidden" name="on" value={user.newcomerTrack ? "0" : "1"} />
              <button className={user.newcomerTrack ? "btn-secondary" : "btn-primary"} aria-pressed={user.newcomerTrack}>
                {user.newcomerTrack ? "Newcomer track is on. Turn off" : "Turn on newcomer track"}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-sm"><Link className="link" href="/sign-in?next=/newcomers">Sign in</Link> to turn it on.</p>
          )}
        </div>
      </PageHeader>
    <div className="container-page">

      <ol className="mt-12 grid gap-5 md:grid-cols-2">
        {sups.map((s) => (
          <li key={s.slug} className="card card-hover flex flex-col p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-clay-700 font-serif text-paper">{s.code}</span>
            <h2 className="mt-2 text-2xl"><Link href={`/newcomers/${s.slug}`} className="hover:text-cedar-700">{s.title}</Link></h2>
            <p className="mt-2 flex-1 text-[15px] text-ink-soft">{s.summary}</p>
            <p className="mt-4 text-sm text-ink-soft">
              Goes with: {s.modules.map((m, i) => <span key={m}>{i > 0 && ", "}<Link className="link" href={`/course/${m}`}>{titleOf(m)}</Link></span>)}
            </p>
            <Link href={`/newcomers/${s.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-700 hover:underline">Read {s.code} <ArrowRight size={16} aria-hidden="true" /></Link>
          </li>
        ))}
      </ol>
    </div>
    </>
  );
}
