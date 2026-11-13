"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import type { ChecklistGroup } from "@/lib/content";
import { toggleChecklistAction } from "@/app/actions/workspace";

export function Checklist({ groups, checked, signedIn }: { groups: ChecklistGroup[]; checked: string[]; signedIn: boolean }) {
  const [, start] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(new Set(checked), (s: Set<string>, u: { key: string; on: boolean }) => {
    const n = new Set(s);
    if (u.on) n.add(u.key);
    else n.delete(u.key);
    return n;
  });
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div>
      <p className="font-serif text-3xl text-cedar-900" role="status" aria-live="polite">
        {optimistic.size} of {total} done
      </p>
      <p className="mt-1 text-sm text-ink-soft">This is a count of what you have prepared. It is not a score or a rating of you.</p>
      {!signedIn && <p className="mt-4 text-[15px]"><Link className="link" href="/sign-in?next=/tools/checklist">Sign in</Link> to save your checklist.</p>}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <fieldset key={g.title} className="card p-6">
            <legend className="float-left w-full font-serif text-xl text-cedar-900">{g.title}</legend>
            <ul className="clear-both space-y-3 pt-4">
              {g.items.map((i) => (
                <li key={i.key} className="flex items-start gap-3">
                  <input
                    id={i.key}
                    type="checkbox"
                    className="mt-1 h-5 w-5 shrink-0 accent-cedar-700"
                    checked={optimistic.has(i.key)}
                    disabled={!signedIn}
                    onChange={(e) => {
                      const on = e.target.checked;
                      start(async () => {
                        setOptimistic({ key: i.key, on });
                        await toggleChecklistAction(i.key, on);
                      });
                    }}
                  />
                  <label htmlFor={i.key} className="text-[15px]">
                    {i.label}
                    {i.module && <> · <Link className="link text-sm" href={`/course/${i.module}`}>related module</Link></>}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
