"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Gives the header a dark treatment on the home page, where it sits on the dark hero. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const dark = usePathname() === "/";
  return (
    <header
      data-tone={dark ? "dark" : "light"}
      className={`group/hdr sticky top-0 z-30 border-b backdrop-blur-xl ${dark ? "border-white/[0.08] bg-[#10241A]/90" : "border-line/60 bg-paper/85"}`}
    >
      {children}
    </header>
  );
}
