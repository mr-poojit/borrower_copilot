import { BorrowerProfile, CreditScoreBand, IncomeType, LoanTypeChoice } from "../types";

const UNKNOWN_SENTINEL = "__unknown__";

function num(v: unknown): number | undefined {
  if (v === "" || v === null || v === undefined || v === UNKNOWN_SENTINEL) return undefined;
  if (v === true || v === false) return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function str(v: unknown, fallback = ""): string {
  if (v === undefined || v === null || v === UNKNOWN_SENTINEL) return fallback;
  return String(v);
}

export function mapAnswers(answers: Record<string, unknown>): BorrowerProfile {
  const unknownFields: string[] = [];
  for (const [key, value] of Object.entries(answers)) {
    if (value === UNKNOWN_SENTINEL || value === -1) unknownFields.push(key);
  }

  const credit = str(answers.creditScoreBand, "unknown") as CreditScoreBand;
  const incomeType = (str(answers.incomeType, "salaried") as IncomeType) || "salaried";

  return {
    age: num(answers.age) ?? 30,
    loanPurpose: str(answers.loanPurpose, "personal"),
    loanType: (str(answers.loanType, "unknown") as LoanTypeChoice) || "unknown",
    requestedAmount: num(answers.requestedAmount) ?? 0,
    incomeType,
    monthlyIncome: num(answers.monthlyIncome) ?? 0,
    documentedAnnualIncome: num(answers.documentedAnnualIncome),
    existingEMI: num(answers.existingEMI) ?? 0,
    householdExpenses: num(answers.householdExpenses) ?? 0,
    creditScoreBand: ["750+", "700-749", "650-699", "below-650", "unknown"].includes(credit)
      ? credit
      : "unknown",
    emergencySavingsMonths: num(answers.emergencySavingsMonths),
    employmentYears: num(answers.employmentYears),
    incomeStable:
      answers.incomeStable === undefined || answers.incomeStable === UNKNOWN_SENTINEL
        ? undefined
        : Boolean(answers.incomeStable === true || answers.incomeStable === "true"),
    businessYears: num(answers.businessYears),
    propertyValue: num(answers.propertyValue),
    goldValue: num(answers.goldValue),
    existingLoans: num(answers.existingLoans),
    missedPayments: num(answers.missedPayments),
    expectedAdditionalIncome: num(answers.expectedAdditionalIncome),
    variableIncomeShare: num(answers.variableIncomeShare),
    coApplicantIncome: num(answers.coApplicantIncome),
    dependents: num(answers.dependents),
    cardUtilisation: num(answers.cardUtilisation),
    offerRate: num(answers.offerRate),
    unknownFields: [...new Set(unknownFields)],
  };
}

export { UNKNOWN_SENTINEL };
