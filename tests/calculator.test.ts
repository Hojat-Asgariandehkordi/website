import { describe, expect, it } from "vitest";
import { calculate, DEFAULT_INPUTS, monthlyPayment, parseInputs } from "@/lib/calculator";

describe("monthlyPayment", () => {
  it("matches the reference case: $100,000 at 6% over 10 years ≈ $1,110.21", () => {
    expect(monthlyPayment(100_000, 6, 10)).toBeCloseTo(1110.21, 2);
  });
  it("allows a 0% rate (straight-line repayment)", () => {
    expect(monthlyPayment(120_000, 0, 10)).toBeCloseTo(1000, 6);
  });
  it("returns 0 for zero principal", () => {
    expect(monthlyPayment(0, 7, 10)).toBe(0);
  });
  it("is fully amortizing: the payments repay the principal exactly", () => {
    const P = 250_000, rate = 7.5, years = 7;
    const pmt = monthlyPayment(P, rate, years);
    let bal = P;
    for (let k = 0; k < years * 12; k++) bal = bal * (1 + rate / 1200) - pmt;
    expect(Math.abs(bal)).toBeLessThan(1e-6);
  });
});

describe("calculate", () => {
  it("computes every output for a typical deal", () => {
    const r = calculate({ ...DEFAULT_INPUTS, purchasePrice: 1_000_000, downPayment: 100_000, sellerFinancing: 100_000, bankRatePct: 6, bankTermYears: 10, sellerRatePct: 0, sellerTermYears: 5, annualSde: 300_000, closingCosts: 25_000 });
    expect(r.bankPrincipal).toBe(800_000);
    expect(r.monthlyBankPayment).toBeCloseTo(1110.205 * 8, 1);
    expect(r.monthlySellerPayment).toBeCloseTo(100_000 / 60, 6);
    expect(r.monthlyDebtService).toBeCloseTo(r.monthlyBankPayment + r.monthlySellerPayment, 9);
    expect(r.annualDebtService).toBeCloseTo(r.monthlyDebtService * 12, 9);
    expect(r.debtServiceCoverage!).toBeCloseTo(300_000 / r.annualDebtService, 9);
    expect(r.buyerTakeHomeMonthly).toBeCloseTo(25_000 - r.monthlyDebtService, 9);
    expect(r.cashToClose).toBe(125_000);
    expect(r.warnings).toEqual([]);
  });
  it("never produces a negative bank loan", () => {
    const r = calculate({ ...DEFAULT_INPUTS, purchasePrice: 100_000, downPayment: 80_000, sellerFinancing: 50_000 });
    expect(r.bankPrincipal).toBe(0);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
  it("reports no coverage ratio when there is no debt", () => {
    const r = calculate({ ...DEFAULT_INPUTS, purchasePrice: 100_000, downPayment: 100_000, sellerFinancing: 0 });
    expect(r.debtServiceCoverage).toBeNull();
  });
  it("warns when debt service exceeds cash flow", () => {
    const r = calculate({ ...DEFAULT_INPUTS, annualSde: 10_000 });
    expect(r.buyerTakeHomeMonthly).toBeLessThan(0);
    expect(r.warnings.join(" ")).toMatch(/larger than the business cash flow/);
  });
});

describe("parseInputs", () => {
  it("rejects negative or non-numeric values", () => {
    expect(parseInputs({ ...DEFAULT_INPUTS, purchasePrice: -1 })).toBeNull();
    expect(parseInputs({ ...DEFAULT_INPUTS, bankRatePct: "abc" })).toBeNull();
    expect(parseInputs({ ...DEFAULT_INPUTS })).toEqual(DEFAULT_INPUTS);
  });
});
