"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { href: string; label: string };

export function MobileMenu({ main, account }: { main: readonly Item[]; account: readonly Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-cedar-900 group-data-[tone=dark]/hdr:border-white/25 group-data-[tone=dark]/hdr:text-paper"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          {open ? (
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="absolute inset-x-0 top-full z-40 border-b border-line bg-paper shadow-lg">
          <ul className="container-page flex flex-col py-4">
            {main.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="block border-b border-line/60 py-3 font-serif text-xl text-cedar-900" aria-current={pathname.startsWith(i.href) ? "page" : undefined}>
                  {i.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-wrap gap-3 pt-5">
              {account.map((i, idx) => (
                <Link key={i.href} href={i.href} className={idx === account.length - 1 ? "btn-primary" : "btn-secondary"}>
                  {i.label}
                </Link>
              ))}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
