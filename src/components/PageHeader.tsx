import type { ReactNode } from "react";

/** Shared page hero band used on interior pages. */
export function PageHeader({ eyebrow, title, intro, children, tone = "light" }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; tone?: "light" | "clay" }) {
  return (
    <div className={`relative overflow-hidden border-b border-line/70 ${tone === "clay" ? "bg-gradient-to-b from-clay-100/70 to-paper" : "bg-gradient-to-b from-cedar-50 to-paper"}`}>
      <div aria-hidden="true" className="bg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-page relative grid gap-10 pb-14 pt-14 sm:pt-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="animate-rise">
          <p className={`eyebrow ${tone === "clay" ? "text-clay-700" : ""}`}>{eyebrow}</p>
          <h1 className="mt-4 text-[40px] leading-[1.05] sm:text-6xl">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg text-ink-soft">{intro}</p>}
        </div>
        {children && <div className="animate-rise [animation-delay:120ms]">{children}</div>}
      </div>
    </div>
  );
}
