import Link from "next/link";

/** The final logo is not decided yet. Replace the [LOGO] slot when it is. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-md" aria-label="NextOwner home">
      <span
        aria-hidden="true"
        data-logo-slot
        className={`inline-flex h-9 items-center rounded-[9px] px-1.5 font-mono text-[9.5px] tracking-wider ${
          light
            ? "border border-white/25 text-[#E6CC8A]"
            : "border border-cedar-900/25 text-cedar-900 group-data-[tone=dark]/hdr:border-white/25 group-data-[tone=dark]/hdr:text-[#E6CC8A]"
        }`}
      >
        [LOGO]
      </span>
      <span className={`font-serif text-[23px] font-medium tracking-tight ${light ? "text-paper" : "text-cedar-900 group-data-[tone=dark]/hdr:text-paper"}`}>NextOwner</span>
    </Link>
  );
}
