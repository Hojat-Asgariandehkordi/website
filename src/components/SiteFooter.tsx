import Link from "next/link";
import { MAIN_NAV } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep/60">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-xl text-cedar-900">NextOwner</p>
          <p className="mt-3 max-w-sm text-sm text-ink-soft">
            Preparation for people buying an existing small business in Canada, with an extra pathway for newcomers.
          </p>
          <p className="mt-4 max-w-sm text-xs text-ink-soft">
            Course material is educational. It cites public sources and is not affiliated with any university, lender or government program.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {MAIN_NAV.map((i) => (
              <li key={i.href}><Link className="text-ink-soft hover:text-cedar-700" href={i.href}>{i.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow">Language</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-ink-soft hover:text-cedar-700" href="/" lang="en">English</Link></li>
            <li><Link className="text-ink-soft hover:text-cedar-700" href="/fr" lang="fr">Français (brouillon)</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
