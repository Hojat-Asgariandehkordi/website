"use client";

import { useActionState, useMemo, useState } from "react";
import { calculate, DEFAULT_INPUTS, formatCad, formatCad2, type CalculatorInputs } from "@/lib/calculator";
import { deleteScenarioAction, saveScenarioAction, type ScenarioState } from "@/app/actions/workspace";

type Scenario = { id: number; name: string; inputs: CalculatorInputs; createdAt: number };

const FIELDS: { key: keyof CalculatorInputs; label: string; suffix?: string; prefix?: string; step: number; hint?: string }[] = [
  { key: "purchasePrice", label: "Purchase price", prefix: "$", step: 1000 },
  { key: "downPayment", label: "Down payment (your equity)", prefix: "$", step: 1000 },
  { key: "sellerFinancing", label: "Seller financing (vendor take-back)", prefix: "$", step: 1000 },
  { key: "bankRatePct", label: "Bank interest rate", suffix: "%", step: 0.05 },
  { key: "bankTermYears", label: "Bank term", suffix: "years", step: 1 },
  { key: "sellerRatePct", label: "Seller-note interest rate", suffix: "%", step: 0.05 },
  { key: "sellerTermYears", label: "Seller-note term", suffix: "years", step: 1 },
  { key: "annualSde", label: "Annual business cash flow (SDE)", prefix: "$", step: 1000 },
  { key: "closingCosts", label: "Closing costs (legal, accounting, lender fees)", prefix: "$", step: 1000, hint: "Optional. Added to cash to close." },
];

export function AffordabilityCalculator({ scenarios, signedIn }: { scenarios: Scenario[]; signedIn: boolean }) {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const r = useMemo(() => calculate(inputs), [inputs]);
  const [state, saveAction, pending] = useActionState<ScenarioState, FormData>(saveScenarioAction, undefined);

  const set = (k: keyof CalculatorInputs, v: string) => {
    const n = v === "" ? 0 : Number(v);
    if (Number.isFinite(n) && n >= 0) setInputs((p) => ({ ...p, [k]: n }));
  };

  const dscr = r.debtServiceCoverage;
  const outputs: { label: string; value: string; note?: string; strong?: boolean }[] = [
    { label: "Bank principal", value: formatCad(r.bankPrincipal), note: "Price minus down payment and seller financing" },
    { label: "Monthly bank payment", value: formatCad2(r.monthlyBankPayment) },
    { label: "Monthly seller-note payment", value: formatCad2(r.monthlySellerPayment) },
    { label: "Total debt service", value: `${formatCad2(r.monthlyDebtService)} / month`, note: `${formatCad(r.annualDebtService)} a year` },
    { label: "Debt service coverage", value: dscr === null ? "No debt" : `${dscr.toFixed(2)}×`, note: "Annual cash flow ÷ annual debt service", strong: true },
    { label: "Buyer take-home before tax", value: `${formatCad2(r.buyerTakeHomeMonthly)} / month`, note: "Monthly cash flow minus debt service", strong: true },
    { label: "Cash to close", value: formatCad(r.cashToClose), note: "Down payment plus closing costs" },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
      <form className="card space-y-5 p-7" onSubmit={(e) => e.preventDefault()} aria-label="Calculator inputs">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="label">{f.label}</label>
            <div className="relative mt-1">
              {f.prefix && <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft">{f.prefix}</span>}
              <input
                id={f.key}
                type="number"
                inputMode="decimal"
                min={0}
                step={f.step}
                value={inputs[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className={`field mt-0 ${f.prefix ? "pl-7" : ""} ${f.suffix ? "pr-16" : ""}`}
                aria-describedby={f.hint ? `${f.key}-hint` : undefined}
              />
              {f.suffix && <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">{f.suffix}</span>}
            </div>
            {f.hint && <p id={`${f.key}-hint`} className="mt-1 text-xs text-ink-soft">{f.hint}</p>}
          </div>
        ))}
        <button type="button" className="btn-quiet text-sm" onClick={() => setInputs(DEFAULT_INPUTS)}>Reset to example</button>
      </form>

      <div className="space-y-8">
        <section aria-labelledby="results-h" aria-live="polite" className="rounded-2xl bg-cedar-900 p-7 text-paper">
          <h2 id="results-h" className="text-2xl text-paper">Results</h2>
          <dl className="mt-5 divide-y divide-paper/15">
            {outputs.map((o) => (
              <div key={o.label} className="grid grid-cols-[1fr_auto] gap-4 py-3">
                <dt>
                  <span className={o.strong ? "font-semibold" : ""}>{o.label}</span>
                  {o.note && <span className="block text-xs text-paper/70">{o.note}</span>}
                </dt>
                <dd className={`text-right font-serif ${o.strong ? "text-2xl" : "text-xl"} tabular-nums`}>{o.value}</dd>
              </div>
            ))}
          </dl>
          {r.warnings.length > 0 && (
            <ul className="mt-4 space-y-1 rounded-lg bg-clay-100 p-3 text-sm text-clay-700">
              {r.warnings.map((w) => <li key={w}>{w}</li>)}
            </ul>
          )}
          <p className="mt-5 text-xs text-paper/70">Fully amortizing monthly payments. Educational only, not advice. Pending professional review. Lenders set their own requirements; this tool makes no claim about loan approval.</p>
        </section>

        <section aria-labelledby="save-h" className="card p-6">
          <h2 id="save-h" className="text-xl">Save this scenario</h2>
          {signedIn ? (
            <form action={saveAction} className="mt-3 flex flex-wrap items-end gap-3">
              <input type="hidden" name="inputs" value={JSON.stringify(inputs)} />
              <label className="label flex-1" htmlFor="scenario-name">Scenario name
                <input id="scenario-name" name="name" required maxLength={80} placeholder="e.g. HVAC deal, base case" className="field" />
              </label>
              <button className="btn-primary" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
              {state?.error && <p role="alert" className="w-full text-sm text-clay-700">{state.error}</p>}
              {state?.savedName && <p role="status" className="w-full text-sm text-cedar-700">Saved “{state.savedName}”.</p>}
            </form>
          ) : (
            <p className="mt-2 text-[15px] text-ink-soft"><a className="link" href="/sign-in?next=/tools/affordability">Sign in</a> to save named scenarios.</p>
          )}
          {scenarios.length > 0 && (
            <ul className="mt-6 divide-y divide-line border-t border-line">
              {scenarios.map((s) => {
                const sr = calculate(s.inputs);
                return (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span>
                      <span className="font-medium">{s.name}</span>
                      <span className="block text-xs text-ink-soft">{formatCad(s.inputs.purchasePrice)} · coverage {sr.debtServiceCoverage === null ? "n/a" : `${sr.debtServiceCoverage.toFixed(2)}×`}</span>
                    </span>
                    <span className="flex gap-3">
                      <button type="button" className="btn-quiet text-sm" onClick={() => setInputs(s.inputs)}>Load</button>
                      <form action={deleteScenarioAction}>
                        <input type="hidden" name="id" value={s.id} />
                        <button className="btn-quiet text-sm text-clay-700">Delete</button>
                      </form>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
