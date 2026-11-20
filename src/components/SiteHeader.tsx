import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { ACCOUNT_NAV, MAIN_NAV } from "@/lib/nav";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { HeaderShell } from "./HeaderShell";
import { signOutAction } from "@/app/actions/auth";
import { getDb } from "@/lib/db";
import { getNewsPrefs, getReadNews } from "@/lib/repo";
import { getNews, unreadItems } from "@/lib/news";

export async function SiteHeader() {
  const user = await currentUser();
  const account = user ? ACCOUNT_NAV.signedIn : ACCOUNT_NAV.signedOut;
  let newsUnread = 0;
  if (user) {
    const db = getDb();
    newsUnread = unreadItems(getNews(), getReadNews(db, user.id), getNewsPrefs(db, user.id), user.createdAt).length;
  }
  const quiet = "text-[15px] text-ink-soft hover:text-cedar-900 group-data-[tone=dark]/hdr:text-[#CFDCD3] group-data-[tone=dark]/hdr:hover:text-paper";
  const cta = "btn py-2.5 rounded-[10px] font-semibold bg-cedar-900 text-paper hover:bg-cedar-700 group-data-[tone=dark]/hdr:bg-paper group-data-[tone=dark]/hdr:text-cedar-900 group-data-[tone=dark]/hdr:hover:bg-white";
  return (
    <HeaderShell>
      <div className="container-page relative flex h-[72px] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks items={MAIN_NAV} badges={{ "/news": newsUnread }} />
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          {user ? (
            <>
              <form action={signOutAction}>
                <button className={quiet} type="submit">Sign out</button>
              </form>
              <Link href="/dashboard" className={cta}>Dashboard <ArrowRight size={16} aria-hidden="true" /></Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className={quiet}>Sign in</Link>
              <Link href="/sign-up" className={cta}>Create free account</Link>
            </>
          )}
        </div>
        <MobileMenu main={MAIN_NAV} account={account} />
      </div>
    </HeaderShell>
  );
}
