import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { ACCOUNT_NAV, MAIN_NAV } from "@/lib/nav";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { signOutAction } from "@/app/actions/auth";

export async function SiteHeader() {
  const user = await currentUser();
  const account = user ? ACCOUNT_NAV.signedIn : ACCOUNT_NAV.signedOut;
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-paper/80 backdrop-blur-xl">
      <div className="container-page relative flex h-[68px] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks items={MAIN_NAV} />
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <>
              <form action={signOutAction}>
                <button className="text-[14.5px] text-ink-soft hover:text-cedar-900" type="submit">Sign out</button>
              </form>
              <Link href="/dashboard" className="btn-primary py-2">Dashboard <ArrowRight size={16} aria-hidden="true" /></Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-[14.5px] text-ink-soft hover:text-cedar-900">Sign in</Link>
              <Link href="/sign-up" className="btn-primary py-2">Create account <ArrowRight size={16} aria-hidden="true" /></Link>
            </>
          )}
        </div>
        <MobileMenu main={MAIN_NAV} account={account} />
      </div>
    </header>
  );
}
