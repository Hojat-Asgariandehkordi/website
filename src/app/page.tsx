import Link from "next/link";
import { getModules } from "@/lib/content";
import { ModulePath } from "@/components/ModulePath";

const pillars = [
  { href: "/course", eyebrow: "01", title: "Course", body: "Twelve modules, from deciding whether buying is right for you to pitching a deal. Each ends with something practical you produce." },
  { href: "/deal-team", eyebrow: "02", title: "Deal Team", body: "Understand what a broker, lawyer, accountant, lender, valuator, insurance advisor and mentor each do, and keep a private list of yours." },
  { href: "/tools", eyebrow: "03", title: "Tools", body: "Practise real deal work. Start with the affordability calculator and the deal-readiness checklist." },
];

export default function HomePage() {
  const modules = getModules();
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cedar-100/60 blur-3xl" />
        <div className="container-page relative grid gap-12 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Entrepreneurship through acquisition, in Canada</p>
            <h1 className="mt-5 text-[44px] leading-[1.05] sm:text-6xl lg:text-[68px]">
              Prepare to buy a small business in Canada with a <em className="font-normal italic text-cedar-700">clearer map.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">
              Learn the whole path, from your first thesis to your first hundred days, build the team you need around you and practise the numbers before real money is on the line.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/course" className="btn-primary px-6 py-3 text-base">Start with the course</Link>
              <Link href="/newcomers" className="btn-secondary px-6 py-3 text-base">For newcomers</Link>
            </div>
          </div>
          <div className="card relative p-7">
            <p className="eyebrow text-clay-700">New to Canada?</p>
            <p className="mt-3 font-serif text-2xl leading-snug text-cedar-900">There&apos;s an extra pathway for you.</p>
            <p className="mt-3 text-[15px] text-ink-soft">
              Six short supplements sit beside the same course: Canadian credit, financing conversations, presenting your experience, Québec and French, status questions and the extra people worth adding to your team.
            </p>
            <Link href="/newcomers" className="link mt-4 inline-block text-[15px]">See the newcomer pathway</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="path-heading" className="border-y border-line bg-paper-card/70">
        <div className="container-page py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">The path</p>
              <h2 id="path-heading" className="mt-3 text-3xl sm:text-4xl">Twelve modules, numbered 0 to 11</h2>
            </div>
            <Link href="/course" className="link text-[15px]">View the full course</Link>
          </div>
          <div className="mt-12">
            <ModulePath modules={modules} />
          </div>
        </div>
      </section>

      <section aria-labelledby="pillars-heading" className="container-page py-20">
        <h2 id="pillars-heading" className="sr-only">What NextOwner offers</h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="card group flex h-full flex-col p-7 transition-colors hover:border-cedar-300">
                <span className="font-serif text-sm text-cedar-500">{p.eyebrow}</span>
                <span className="mt-6 font-serif text-3xl text-cedar-900">{p.title}</span>
                <span className="mt-3 flex-1 text-[15px] text-ink-soft">{p.body}</span>
                <span className="mt-6 text-[15px] font-medium text-cedar-700 group-hover:underline">Open {p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page">
        <div className="rounded-2xl bg-cedar-900 px-8 py-14 text-paper sm:px-14">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl text-paper sm:text-4xl">Start free with Modules 0 and 1.</h2>
              <p className="mt-4 max-w-xl text-paper/80">
                Work out whether buying fits your life, then write the thesis that will guide your search.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link href="/course/is-buying-right-for-me" className="btn bg-paper text-cedar-900 hover:bg-paper-deep">Begin Module 0</Link>
              <Link href="/pricing" className="btn border border-paper/40 text-paper hover:bg-cedar-700">See pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
