import Link from "next/link";
import { MAIN_NAV } from "@/lib/nav";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-28 bg-cedar-900 text-paper">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-[15px] text-paper/75">
            Preparation for people buying an existing small business in Canada, with an extra pathway for newcomers.
          </p>
          <p className="mt-6 max-w-sm text-xs leading-relaxed text-paper/60">
            Course material is educational. It cites public sources and is not affiliated with any university, lender or government program.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cedar-100">Explore</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {MAIN_NAV.map((i) => (
              <li key={i.href}><Link className="text-paper/80 hover:text-paper" href={i.href}>{i.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cedar-100">Language</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link className="text-paper/80 hover:text-paper" href="/" lang="en">English</Link></li>
            <li><Link className="text-paper/80 hover:text-paper" href="/fr" lang="fr">Français (brouillon)</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-xs text-paper/60">© {new Date().getFullYear()} NextOwner. Local prototype.</p>
      </div>
    </footer>
  );
}
