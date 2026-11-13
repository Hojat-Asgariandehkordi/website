import { Check, Users, TrendingUp, PlayCircle } from "lucide-react";

/** Illustrative product preview for the home hero. Decorative: screen readers get a short description. */
export function HeroPreview() {
  const rows = [
    { n: 0, t: "Is buying a business right for me?", s: "done" },
    { n: 1, t: "Acquisition thesis and criteria", s: "done" },
    { n: 2, t: "Sourcing and outreach", s: "now" },
    { n: 3, t: "Screening a CIM", s: "next" },
    { n: 4, t: "Quality of earnings", s: "next" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <p className="sr-only">Preview of the NextOwner dashboard, showing course progress, a calculator result and a Deal Team list.</p>
      <div aria-hidden="true" className="relative text-ink">
        <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(169,130,44,.35),transparent)] blur-2xl" />
        {/* main window */}
        <div className="relative rounded-3xl border border-white/10 bg-[#F8F4EC] p-1.5 shadow-glow">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E2B4A0]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E9D59B]" />
            <span className="h-2.5 w-2.5 rounded-full bg-cedar-300" />
            <span className="ml-3 h-5 flex-1 rounded-md bg-paper-deep/80" />
          </div>
          <div className="rounded-[20px] bg-paper-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cedar-700">Your path</p>
                <p className="mt-1 font-serif text-2xl text-cedar-900">Module 2 of 11</p>
              </div>
              <span className="rounded-full bg-cedar-100 px-2.5 py-1 text-[11px] font-semibold text-cedar-900">38% complete</span>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-paper-deep"><div className="h-1.5 w-[38%] rounded-full bg-gradient-to-r from-cedar-500 to-cedar-700" /></div>
            <ul className="mt-5 space-y-2">
              {rows.map((r) => (
                <li key={r.n} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] ${r.s === "now" ? "bg-white shadow-sm ring-1 ring-cedar-100" : ""}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${r.s === "done" ? "bg-cedar-700 text-paper" : r.s === "now" ? "border-2 border-cedar-700 text-cedar-900" : "border border-line text-ink-soft"}`}>
                    {r.s === "done" ? <Check size={13} strokeWidth={3} /> : r.n}
                  </span>
                  <span className={r.s === "next" ? "text-ink-soft" : "text-ink"}>{r.t}</span>
                  {r.s === "now" && <PlayCircle size={16} className="ml-auto text-cedar-700" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* floating calculator card */}
        <div className="absolute -bottom-10 -left-6 w-[230px] animate-float rounded-2xl border border-line bg-white p-4 shadow-lift sm:-left-12">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cedar-700"><TrendingUp size={14} /> Affordability</div>
          <p className="mt-2 font-serif text-3xl text-cedar-900">1.62×</p>
          <p className="text-[12px] text-ink-soft">Debt service coverage</p>
          <div className="mt-3 flex items-end gap-1">
            {[40, 55, 48, 70, 62, 82].map((h, i) => <span key={i} className="w-full rounded-sm bg-cedar-100" style={{ height: h * 0.4 }}><span className="block w-full rounded-sm bg-cedar-500" style={{ height: `${h}%` }} /></span>)}
          </div>
        </div>
        {/* floating team card */}
        <div className="absolute -right-4 -top-8 w-[210px] animate-float rounded-2xl border border-line bg-white p-4 shadow-lift [animation-delay:-3.5s] sm:-right-10">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cedar-700"><Users size={14} /> Deal Team</div>
          <ul className="mt-3 space-y-2 text-[12.5px]">
            {[["LW", "Lawyer", "Engaged", "bg-cedar-700 text-paper"], ["CP", "CPA", "Talking", "bg-brass-100 text-ink"], ["LN", "Lender", "Not contacted", "bg-paper-deep text-ink-soft"]].map(([i, r, s, c]) => (
              <li key={r} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cedar-50 text-[10px] font-semibold text-cedar-900">{i}</span>
                <span className="flex-1">{r}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${c}`}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
