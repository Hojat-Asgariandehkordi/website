"use client";

import { useActionState, useRef, useEffect } from "react";
import { addTeamMemberAction, deleteTeamMemberAction, updateTeamMemberAction, type TeamState } from "@/app/actions/workspace";

type Member = { id: number; name: string; firm: string; role: string; status: string; notes: string };
type RoleOpt = { slug: string; title: string };

export const STATUS_LABELS: Record<string, string> = { not_contacted: "Not contacted", talking: "Talking", engaged: "Engaged" };

function Fields({ roles, m }: { roles: RoleOpt[]; m?: Member }) {
  const id = m ? `m${m.id}` : "new";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="label" htmlFor={`${id}-name`}>Name<input id={`${id}-name`} name="name" required maxLength={120} defaultValue={m?.name} className="field" /></label>
      <label className="label" htmlFor={`${id}-firm`}>Firm<input id={`${id}-firm`} name="firm" maxLength={120} defaultValue={m?.firm} className="field" /></label>
      <label className="label" htmlFor={`${id}-role`}>Role
        <select id={`${id}-role`} name="role" required defaultValue={m?.role ?? ""} className="field">
          <option value="" disabled>Choose a role</option>
          {roles.map((r) => <option key={r.slug} value={r.slug}>{r.title}</option>)}
        </select>
      </label>
      <label className="label" htmlFor={`${id}-status`}>Status
        <select id={`${id}-status`} name="status" defaultValue={m?.status ?? "not_contacted"} className="field">
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label className="label sm:col-span-2" htmlFor={`${id}-notes`}>Notes<textarea id={`${id}-notes`} name="notes" rows={2} maxLength={2000} defaultValue={m?.notes} className="field" /></label>
    </div>
  );
}

export function TeamManager({ members, roles }: { members: Member[]; roles: RoleOpt[] }) {
  const [state, action, pending] = useActionState<TeamState, FormData>(addTeamMemberAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state && !state.error) formRef.current?.reset();
  }, [state]);
  const roleTitle = (slug: string) => roles.find((r) => r.slug === slug)?.title ?? slug;

  return (
    <div className="space-y-8">
      {members.length === 0 ? (
        <p className="text-ink-soft">Your team list is empty. Add the first person below.</p>
      ) : (
        <ul className="space-y-4">
          {members.map((m) => (
            <li key={m.id} className="card p-5">
              <details>
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <span>
                    <span className="font-serif text-xl text-cedar-900">{m.name}</span>
                    {m.firm && <span className="text-ink-soft">, {m.firm}</span>}
                    <span className="block text-sm text-ink-soft">{roleTitle(m.role)}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className={`tag ${m.status === "engaged" ? "bg-cedar-700 text-paper" : m.status === "talking" ? "bg-brass-100 text-ink" : "bg-paper-deep text-ink-soft"}`}>{STATUS_LABELS[m.status]}</span>
                    <span className="text-sm text-cedar-700 underline">Edit</span>
                  </span>
                </summary>
                {m.notes && <p className="mt-3 whitespace-pre-line text-sm text-ink-soft">{m.notes}</p>}
                <form action={updateTeamMemberAction} className="mt-5 space-y-4 border-t border-line pt-5">
                  <input type="hidden" name="id" value={m.id} />
                  <Fields roles={roles} m={m} />
                  <button className="btn-primary">Save changes</button>
                </form>
                <form action={deleteTeamMemberAction} className="mt-3">
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn-quiet text-clay-700">Remove from my team</button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
      <form ref={formRef} action={action} className="card space-y-4 p-6">
        <h3 className="text-xl">Add a person</h3>
        <Fields roles={roles} />
        {state?.error && <p role="alert" className="text-sm text-clay-700">{state.error}</p>}
        <button className="btn-primary" disabled={pending}>{pending ? "Adding…" : "Add to my team"}</button>
      </form>
    </div>
  );
}
