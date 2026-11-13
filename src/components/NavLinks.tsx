"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ items }: { items: readonly { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-8 text-[15px]">
      {items.map((i) => {
        const active = pathname === i.href || pathname.startsWith(i.href + "/");
        return (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={active ? "page" : undefined}
              className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:transition-colors ${
                active
                  ? "text-cedar-900 after:bg-cedar-700 group-data-[tone=dark]/hdr:text-paper group-data-[tone=dark]/hdr:after:bg-[#E6CC8A]"
                  : "text-ink-soft after:bg-transparent hover:text-cedar-900 group-data-[tone=dark]/hdr:text-[#CFDCD3] group-data-[tone=dark]/hdr:hover:text-paper"
              }`}
            >
              {i.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
