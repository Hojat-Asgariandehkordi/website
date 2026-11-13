import Link from "next/link";
import { Compass, Search, BarChart3, Landmark, ShieldCheck, KeyRound, Check } from "lucide-react";
import type { CourseModule } from "@/lib/content";

const PHASE_ICONS: Record<string, typeof Compass> = {
  Decide: Compass,
  Find: Search,
  Analyze: BarChart3,
  "Finance and negotiate": Landmark,
  "Verify and structure": ShieldCheck,
  Own: KeyRound,
};

/** The 12-module path, grouped by phase. Optionally shows completion per module. */
export function ModulePath({ modules, completedModules, compact = false }: { modules: CourseModule[]; completedModules?: Set<string>; compact?: boolean }) {
  const phases: { name: string; mods: CourseModule[] }[] = [];
  for (const m of modules) {
    const last = phases[phases.length - 1];
    if (last && last.name === m.phase) last.mods.push(m);
    else phases.push({ name: m.phase, mods: [m] });
  }
  return (
    <ol className={`grid gap-4 sm:grid-cols-2 ${compact ? "xl:grid-cols-3" : "lg:grid-cols-3"}`} aria-label="Course path, modules 0 to 11">
      {phases.map((p, idx) => {
        const Icon = PHASE_ICONS[p.name] ?? Compass;
        return (
          <li key={p.name} className="group relative rounded-2xl border border-line/80 bg-white/70 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cedar-900 text-cedar-100 shadow-sm"><Icon size={18} aria-hidden="true" /></span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Phase {idx + 1}</p>
                <p className="font-serif text-lg leading-tight text-cedar-900">{p.name}</p>
              </div>
            </div>
            <ol className="mt-4 space-y-1">
              {p.mods.map((m) => {
                const done = completedModules?.has(m.slug);
                return (
                  <li key={m.slug}>
                    <Link href={`/course/${m.slug}`} className="-mx-2 flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-cedar-50">
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-serif text-[13px] ${done ? "bg-cedar-700 text-paper" : "border border-cedar-300 bg-paper text-cedar-900"}`}>
                        {done ? <Check size={14} strokeWidth={3} aria-label="completed" /> : m.number}
                      </span>
                      <span className="pt-1 text-[14.5px] leading-snug text-ink">
                        <span className="sr-only">Module {m.number}: </span>{m.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}
