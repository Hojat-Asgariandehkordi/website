"use client";

import { useActionState } from "react";
import type { QuizQuestion } from "@/lib/content";
import { submitQuizAction, type QuizState } from "@/app/actions/learning";

export function Quiz({ moduleSlug, questions, previous, signedIn }: { moduleSlug: string; questions: QuizQuestion[]; previous?: { correct: number; total: number } | null; signedIn: boolean }) {
  const [state, action, pending] = useActionState<QuizState, FormData>(submitQuizAction, undefined);
  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="module" value={moduleSlug} />
      {previous && !state && (
        <p className="text-sm text-ink-soft">Your last saved result: {previous.correct} of {previous.total} correct.</p>
      )}
      {questions.map((q, qi) => {
        const result = state?.results[qi];
        return (
          <fieldset key={q.id} className="card p-6">
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="font-serif text-xl text-cedar-900"><span className="text-cedar-500">{qi + 1}.</span> {q.question}</p>
            <div className="mt-4 space-y-2">
              {q.options.map((opt, oi) => (
                <label key={oi} className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2 hover:border-line hover:bg-paper">
                  <input type="radio" name={q.id} value={oi} required className="mt-1.5 h-4 w-4 accent-cedar-700" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {state && (
              <div className={`mt-4 rounded-lg px-4 py-3 text-[15px] ${result ? "bg-cedar-50 text-cedar-900" : "bg-clay-100 text-clay-700"}`} role="status">
                <strong>{result ? "Correct." : `Not quite. The answer is: ${q.options[q.answer]}.`}</strong> {q.explanation}
              </div>
            )}
          </fieldset>
        );
      })}
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn-primary" disabled={pending}>{pending ? "Checking…" : state ? "Submit again" : "Check my answers"}</button>
        {state && (
          <p role="status" className="text-[15px]">
            {state.correct} of {state.total} correct. {state.saved ? "Result saved to your dashboard." : signedIn ? "" : "Sign in to save your results."}
          </p>
        )}
      </div>
    </form>
  );
}
