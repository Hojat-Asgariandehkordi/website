import Link from "next/link";
import type { Metadata } from "next";
import { getRoles } from "@/lib/content";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listTeam } from "@/lib/repo";
import { TeamManager } from "@/components/TeamManager";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Deal Team" };
export const dynamic = "force-dynamic";

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-cedar-700">{title}</h4>
      <ul className="mt-2 space-y-1.5 text-[15px]">
        {items.map((i) => <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-cedar-500">–</span>{i}</li>)}
      </ul>
    </div>
  );
}

export default async function DealTeamPage() {
  const roles = getRoles();
  const user = await currentUser();
  const members = user ? listTeam(getDb(), user.id) : [];
  return (
    <>
      <PageHeader eyebrow="Deal Team" title="You don’t buy a business alone" intro="Every acquisition needs a small group of professionals. Learn what each one does, what they don’t do, when you need them and what to ask. Then keep a private list of your own team." />
    <div className="container-page">
      <nav aria-label="Roles" className="sticky top-[68px] z-20 -mx-5 mt-0 border-b border-line/60 bg-paper/85 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 flex flex-wrap gap-2">
        {roles.map((r) => <a key={r.slug} href={`#${r.slug}`} className="tag border border-line bg-paper-card px-3 py-1.5 text-sm font-medium text-ink hover:border-cedar-300">{r.title}</a>)}
        <a href="#my-team" className="tag bg-cedar-700 px-3 py-1.5 text-sm font-medium text-paper">My team</a>
      </nav>

      <div className="mt-12 space-y-8">
        {roles.map((r) => (
          <Reveal key={r.slug}><section id={r.slug} aria-labelledby={`${r.slug}-h`} className="card scroll-mt-40 p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id={`${r.slug}-h`} className="text-3xl">{r.title}</h2>
              {r.newcomerOnly && <span className="tag bg-clay-100 text-clay-700">For newcomers</span>}
            </div>
            <p className="mt-2 max-w-2xl text-ink-soft">{r.summary}</p>
            <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <List title="What they do" items={r.does} />
              <List title="What they don't do" items={r.doesNot} />
              <List title="When you need them" items={r.whenYouNeed} />
              <List title="Questions to ask" items={r.questions} />
            </div>
            {r.links.length > 0 && (
              <p className="mt-6 text-sm">
                Find one: {r.links.map((l, i) => <span key={l.url}>{i > 0 && " · "}<a className="link" href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a></span>)}
              </p>
            )}
          </section></Reveal>
        ))}
      </div>

      <section id="my-team" aria-labelledby="my-team-h" className="mt-16 scroll-mt-40">
        <h2 id="my-team-h" className="text-3xl">My team</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          A private list only you can see. NextOwner has no public directory and never contacts anyone on your behalf.
        </p>
        <div className="mt-6">
          {user ? (
            <TeamManager members={members} roles={roles.map((r) => ({ slug: r.slug, title: r.title }))} />
          ) : (
            <div className="card p-6"><p><Link className="link" href="/sign-in?next=/deal-team">Sign in</Link> or <Link className="link" href="/sign-up?next=/deal-team">create an account</Link> to build your team list.</p></div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}
