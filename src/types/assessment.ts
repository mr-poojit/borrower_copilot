import { LoanProductType } from "./loanProduct";

export type BorrowDecision = "borrow" | "borrow-less" | "dont-borrow";
export type ConfidenceLevel = "high" | "medium" | "low";

export interface AmountAssessment {
  likelySanction: number;
  likelySanctionLow: number;
  likelySanctionHigh: number;
  safeCarry: number;
  safeCarryLow: number;
  safeCarryHigh: number;
  recommendedAmount: number;
  whichToUse: "safe" | "lender";
  whySanction: string;
  whySafeCarry: string;
  whyUseThis: string;
}

export interface RateAssessment {
  fairMin: number;
  fairMax: number;
  expectedRate: number;
  processingFeePercent: number;
  processingFeeAmount: number;
  processingFeeWithGst: number;
  apr: number;
  aprMin: number;
  aprMax: number;
  why: string;
}

export interface TenureOption {
  months: number;
  emi: number;
  totalInterest: number;
}

export interface EMIAssessment {
  recommendedEMI: number;
  maximumEMI: number;
  tenureMonths: number;
  totalInterest: number;
  tenureOptions: TenureOption[];
  why: string;
}

export interface StressTestResult {
  scenario: string;
  EMI: number;
  remainingIncome: number;
  stressedFOIR: number;
  passes: boolean;
  explanation: string;
}

export interface ProductAdvice {
  requested: LoanProductType | "unknown";
  recommended: LoanProductType;
  name: string;
  secured: boolean;
  reason: string;
}

export interface AssessmentResult {
  decision: BorrowDecision;
  decisionLabel: string;
  decisionReason: string;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  product: ProductAdvice;
  amount: AmountAssessment;
  rate: RateAssessment;
  emi: EMIAssessment;
  stressTest: StressTestResult;
  assumptions: string[];
  unknowns: string[];
  walkAwayRate: number;
  walkAwayEMI: number;
  negotiationBecause: string;
  theirOfferRate?: number;
}
