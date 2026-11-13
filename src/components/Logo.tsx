import Link from "next/link";

/** The final logo is not decided yet. Replace the [LOGO] slot when it is. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5 rounded-md" aria-label="NextOwner home">
      <span
        aria-hidden="true"
        data-logo-slot
        className={`inline-flex h-8 items-center rounded-lg px-1.5 font-mono text-[9px] font-semibold tracking-wider ${light ? "bg-white/10 text-paper ring-1 ring-white/20" : "bg-cedar-900 text-cedar-100"}`}
      >
        [LOGO]
      </span>
      <span className={`font-serif text-[21px] font-semibold tracking-tight ${light ? "text-paper" : "text-cedar-900"}`}>NextOwner</span>
    </Link>
  );
}
