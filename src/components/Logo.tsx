import Link from "next/link";

/** The final logo is not decided yet. Replace the [LOGO] slot when it is. */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-md" aria-label="NextOwner home">
      <span
        className="inline-flex h-9 items-center rounded-md border border-dashed border-cedar-300 px-2 font-mono text-[11px] text-cedar-700"
        aria-hidden="true"
        data-logo-slot
      >
        [LOGO]
      </span>
      <span className="font-serif text-xl font-semibold tracking-tight text-cedar-900">NextOwner</span>
    </Link>
  );
}
