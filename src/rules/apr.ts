import { GST_ON_FEES } from "./constants";

/** Monthly reducing-balance EMI. */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + r, tenureMonths);
  return (principal * r * factor) / (factor - 1);
}

export function principalFromEMI(
  emi: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (emi <= 0 || tenureMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return emi * tenureMonths;
  const factor = Math.pow(1 + r, tenureMonths);
  return (emi * (factor - 1)) / (r * factor);
}

export function totalInterest(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  return emi * tenureMonths - principal;
}

export function feeInclusive(
  principal: number,
  feePercent: number
): { fee: number; feeWithGst: number; netDisbursed: number } {
  const fee = principal * feePercent;
  const feeWithGst = fee * (1 + GST_ON_FEES);
  return {
    fee,
    feeWithGst,
    netDisbursed: Math.max(0, principal - feeWithGst),
  };
}

/**
 * Nominal APR from IRR on net amount received vs EMI outflows.
 * Matches the spirit of RBI all-in cost disclosure (fees in, insurance not modelled).
 */
export function allInApr(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  feePercent: number
): number {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const { netDisbursed } = feeInclusive(principal, feePercent);
  if (netDisbursed <= 0 || emi <= 0) return annualRate;

  let r = annualRate / 100 / 12;
  for (let i = 0; i < 40; i++) {
    const pvAnnuity = (1 - Math.pow(1 + r, -tenureMonths)) / r;
    const f = -netDisbursed + emi * pvAnnuity;
    const df =
      (emi *
        ((-tenureMonths * Math.pow(1 + r, -tenureMonths - 1) * r -
          (1 - Math.pow(1 + r, -tenureMonths))) /
          (r * r)));
    if (Math.abs(df) < 1e-12) break;
    const next = r - f / df;
    if (!Number.isFinite(next) || next <= 0) break;
    if (Math.abs(next - r) < 1e-10) {
      r = next;
      break;
    }
    r = next;
  }

  return r * 12 * 100;
}
