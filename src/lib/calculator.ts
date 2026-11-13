/**
 * Affordability calculator. Pure functions, no I/O.
 * All payments are fully amortizing, monthly, and allow a 0% rate.
 */

export type CalculatorInputs = {
  purchasePrice: number;
  downPayment: number;
  sellerFinancing: number;
  bankRatePct: number;
  bankTermYears: number;
  sellerRatePct: number;
  sellerTermYears: number;
  annualSde: number;
  closingCosts: number;
};

export type CalculatorResult = {
  bankPrincipal: number;
  monthlyBankPayment: number;
  monthlySellerPayment: number;
  monthlyDebtService: number;
  annualDebtService: number;
  /** Annual cash flow (SDE) divided by annual debt service. Null when there is no debt. */
  debtServiceCoverage: number | null;
  buyerTakeHomeMonthly: number;
  cashToClose: number;
  warnings: string[];
};

export const DEFAULT_INPUTS: CalculatorInputs = {
  purchasePrice: 1_000_000,
  downPayment: 100_000,
  sellerFinancing: 100_000,
  bankRatePct: 8,
  bankTermYears: 10,
  sellerRatePct: 6,
  sellerTermYears: 5,
  annualSde: 300_000,
  closingCosts: 40_000,
};

/** Monthly payment for a fully amortizing loan. Handles 0% and zero principal. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0) return 0;
  const n = Math.round(years * 12);
  if (n <= 0) return principal;
  const i = annualRatePct / 100 / 12;
  if (i === 0) return principal / n;
  return (principal * i) / (1 - Math.pow(1 + i, -n));
}

export function calculate(input: CalculatorInputs): CalculatorResult {
  const warnings: string[] = [];
  const price = Math.max(0, input.purchasePrice);
  const down = Math.max(0, input.downPayment);
  const seller = Math.max(0, input.sellerFinancing);

  let bankPrincipal = price - down - seller;
  if (bankPrincipal < 0) {
    warnings.push("Down payment plus seller financing is more than the purchase price, so no bank loan is needed.");
    bankPrincipal = 0;
  }
  if (input.bankTermYears <= 0 && bankPrincipal > 0) warnings.push("Bank term must be longer than zero years.");
  if (input.sellerTermYears <= 0 && seller > 0) warnings.push("Seller-note term must be longer than zero years.");

  const monthlyBankPayment = monthlyPayment(bankPrincipal, input.bankRatePct, input.bankTermYears);
  const monthlySellerPayment = monthlyPayment(seller, input.sellerRatePct, input.sellerTermYears);
  const monthlyDebtService = monthlyBankPayment + monthlySellerPayment;
  const annualDebtService = monthlyDebtService * 12;
  const debtServiceCoverage = annualDebtService > 0 ? input.annualSde / annualDebtService : null;
  const buyerTakeHomeMonthly = input.annualSde / 12 - monthlyDebtService;
  const cashToClose = down + Math.max(0, input.closingCosts);

  if (buyerTakeHomeMonthly < 0) warnings.push("Debt payments are larger than the business cash flow.");

  return {
    bankPrincipal,
    monthlyBankPayment,
    monthlySellerPayment,
    monthlyDebtService,
    annualDebtService,
    debtServiceCoverage,
    buyerTakeHomeMonthly,
    cashToClose,
    warnings,
  };
}

export function parseInputs(raw: unknown): CalculatorInputs | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const out = {} as CalculatorInputs;
  for (const key of Object.keys(DEFAULT_INPUTS) as (keyof CalculatorInputs)[]) {
    const v = Number(r[key] ?? DEFAULT_INPUTS[key]);
    if (!Number.isFinite(v) || v < 0 || v > 1e12) return null;
    out[key] = v;
  }
  return out;
}

const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const cad2 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatCad = (n: number) => cad.format(n);
export const formatCad2 = (n: number) => cad2.format(n);
