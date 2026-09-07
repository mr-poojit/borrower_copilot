export type IncomeType = "salaried" | "self-employed" | "informal";

export type CreditScoreBand =
  | "750+"
  | "700-749"
  | "650-699"
  | "below-650"
  | "unknown";

export type LoanTypeChoice =
  | "personal"
  | "home"
  | "lap"
  | "gold"
  | "two-wheeler"
  | "business"
  | "unknown";

export interface BorrowerProfile {
  age: number;
  loanPurpose: string;
  loanType: LoanTypeChoice;
  requestedAmount: number;
  incomeType: IncomeType;
  monthlyIncome: number;
  documentedAnnualIncome?: number;
  existingEMI: number;
  householdExpenses: number;
  creditScoreBand: CreditScoreBand;
  emergencySavingsMonths?: number;
  employmentYears?: number;
  incomeStable?: boolean;
  businessYears?: number;
  propertyValue?: number;
  goldValue?: number;
  existingLoans?: number;
  missedPayments?: number;
  expectedAdditionalIncome?: number;
  variableIncomeShare?: number;
  coApplicantIncome?: number;
  dependents?: number;
  cardUtilisation?: number;
  offerRate?: number;
  unknownFields: string[];
}

export function isUnknown(profile: BorrowerProfile, field: string): boolean {
  return profile.unknownFields.includes(field);
}
