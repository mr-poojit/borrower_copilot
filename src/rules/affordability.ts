import { BorrowerProfile } from "../types";
import { calculateEMI } from "./emi";

export interface AffordabilityResult {
  monthlyIncome: number;
  existingEMI: number;
  householdExpenses: number;

  disposableIncome: number;

  maximumTotalEMI: number;
  maximumNewEMI: number;

  safeCarryAmount: number;

  why: string;
}

interface AffordabilityOptions {
  foir: number;
  annualRate: number;
  tenureMonths: number;
}

export function calculateAffordability(
  borrower: BorrowerProfile,
  options: AffordabilityOptions
): AffordabilityResult {
  const {
    monthlyIncome,
    existingEMI,
    householdExpenses,
  } = borrower;

  const {
    foir,
    annualRate,
    tenureMonths,
  } = options;

  // Maximum total EMI based on FOIR assumption
  const maximumTotalEMI =
    monthlyIncome * foir;

  // Amount available after existing debt
  const maximumNewEMI = Math.max(
    0,
    maximumTotalEMI - existingEMI
  );

  // Convert affordable EMI into loan principal.
  const emiForOneRupee = calculateEMI({
    principal: 1,
    annualRate,
    tenureMonths,
  }).emi;

  const safeCarryAmount =
    emiForOneRupee > 0
      ? maximumNewEMI / emiForOneRupee
      : 0;

  const disposableIncome =
    monthlyIncome -
    existingEMI -
    householdExpenses;

  return {
    monthlyIncome,
    existingEMI,
    householdExpenses,

    disposableIncome,

    maximumTotalEMI,
    maximumNewEMI,

    safeCarryAmount,

    why: `Your new EMI is capped so that total loan repayments stay within ${(foir * 100).toFixed(0)}% of monthly income.`,
  };
}
