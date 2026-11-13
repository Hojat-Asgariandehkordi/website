"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, signUpAction, type FormState } from "@/app/actions/auth";

export function AuthForm({ mode, next }: { mode: "sign-in" | "sign-up"; next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "sign-in" ? signInAction : signUpAction, undefined);
  return (
    <form action={action} className="card space-y-5 p-8" noValidate={false}>
      <input type="hidden" name="next" value={next} />
      {mode === "sign-up" && (
        <label className="label" htmlFor="name">Name<input id="name" name="name" autoComplete="name" required className="field" /></label>
      )}
      <label className="label" htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="email" required className="field" /></label>
      <label className="label" htmlFor="password">Password
        <input id="password" name="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={mode === "sign-up" ? 10 : undefined} required className="field" aria-describedby={mode === "sign-up" ? "pw-hint" : undefined} />
      </label>
      {mode === "sign-up" && <p id="pw-hint" className="-mt-3 text-xs text-ink-soft">At least 10 characters.</p>}
      {state?.error && <p role="alert" className="rounded-lg bg-clay-100 px-3 py-2 text-sm text-clay-700">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "One moment…" : mode === "sign-in" ? "Sign in" : "Create account"}</button>
      <p className="text-center text-sm text-ink-soft">
        {mode === "sign-in" ? <>New here? <Link className="link" href={`/sign-up?next=${encodeURIComponent(next)}`}>Create an account</Link></> : <>Already have an account? <Link className="link" href={`/sign-in?next=${encodeURIComponent(next)}`}>Sign in</Link></>}
      </p>
    </form>
  );
}
