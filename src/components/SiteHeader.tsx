import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { ACCOUNT_NAV, MAIN_NAV } from "@/lib/nav";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { signOutAction } from "@/app/actions/auth";

export async function SiteHeader() {
  const user = await currentUser();
  const account = user ? ACCOUNT_NAV.signedIn : ACCOUNT_NAV.signedOut;
  return (
    <header className="relative z-30 border-b border-line/70 bg-paper/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[15px]">
            {MAIN_NAV.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-ink-soft transition-colors hover:text-cedar-700">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-primary">Dashboard</Link>
              <form action={signOutAction}>
                <button className="btn-quiet text-[15px]" type="submit">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-[15px] text-ink-soft hover:text-cedar-700">Sign in</Link>
              <Link href="/sign-up" className="btn-primary">Create account</Link>
            </>
          )}
        </div>
        <MobileMenu main={MAIN_NAV} account={account} />
      </div>
    </header>
  );
}
