import Link from "next/link";
import type { CourseModule } from "@/lib/content";

/** The 12-module path, grouped by phase. Optionally shows completion per module. */
export function ModulePath({ modules, completedModules, compact = false }: { modules: CourseModule[]; completedModules?: Set<string>; compact?: boolean }) {
  const phases: { name: string; mods: CourseModule[] }[] = [];
  for (const m of modules) {
    const last = phases[phases.length - 1];
    if (last && last.name === m.phase) last.mods.push(m);
    else phases.push({ name: m.phase, mods: [m] });
  }
  return (
    <div>
      <ol className={`grid gap-x-6 gap-y-8 sm:grid-cols-2 ${compact ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-6"}`} aria-label="Course path, modules 0 to 11">
        {phases.map((p) => (
          <li key={p.name} className="border-t-2 border-cedar-300 pt-3">
            <p className="eyebrow mb-4 text-[11px]">{p.name}</p>
            <ol className="space-y-3">
              {p.mods.map((m) => {
                const done = completedModules?.has(m.slug);
                return (
                  <li key={m.slug}>
                    <Link href={`/course/${m.slug}`} className="group flex items-start gap-3 rounded-xl p-2 -m-2 hover:bg-paper-card">
                      <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-serif text-sm ${done ? "border-cedar-700 bg-cedar-700 text-paper" : "border-cedar-300 bg-paper text-cedar-900 group-hover:border-cedar-700"}`}>
                        {done ? <span aria-label="completed">✓</span> : m.number}
                      </span>
                      <span className="pt-1.5 text-[14px] leading-snug text-ink group-hover:text-cedar-700">
                        <span className="sr-only">Module {m.number}: </span>{m.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}
