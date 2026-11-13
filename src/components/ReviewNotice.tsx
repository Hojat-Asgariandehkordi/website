import { REVIEW_NOTICE } from "@/lib/content";

/** The single review notice used on financing, legal, tax, valuation and immigration-status lessons. */
export function ReviewNotice() {
  return (
    <aside role="note" aria-label="Review notice" data-review-notice className="flex items-start gap-3 rounded-xl border border-brass-500/40 bg-brass-100/60 px-4 py-3 text-sm text-ink">
      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 shrink-0 text-brass-500"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      <p>{REVIEW_NOTICE}</p>
    </aside>
  );
}
