"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ items }: { items: readonly { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1 rounded-full border border-line/70 bg-white/60 p-1 text-[14.5px] shadow-sm">
      {items.map((i) => {
        const active = pathname === i.href || pathname.startsWith(i.href + "/");
        return (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-full px-4 py-1.5 transition-colors ${active ? "bg-cedar-900 text-paper" : "text-ink-soft hover:bg-cedar-50 hover:text-cedar-900"}`}
            >
              {i.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
