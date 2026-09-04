export type BorrowDecision =
    | "borrow"
    | "borrow-less"
    | "dont-borrow";

export type ConfidenceLevel =
    | "high"
    | "medium"
    | "low";

export interface AmountAssessment {
    likelySanction: number;
    safeCarry: number;

    recommendedAmount: number;

    whySanction: string;
    whySafeCarry: string;
}

export interface RateAssessment {
    fairMin: number;
    fairMax: number;

    expectedRate: number;

    processingFee: number;
    processingFeeAmount: number;

    apr: number;

    why: string;
}

export interface EMIAssessment {
    recommendedEMI: number;
    maximumEMI: number;

    tenureMonths: number;

    totalInterest: number;

    why: string;
}

export interface StressTestResult {
    scenario: string;

    incomeAfterStress: number;
    EMI: number;

    remainingIncome: number;

    passes: boolean;

    explanation: string;
}

export interface AssessmentResult {
    decision: BorrowDecision;

    decisionReason: string;

    confidence: ConfidenceLevel;
    confidenceReason: string;

    amount: AmountAssessment;

    rate: RateAssessment;

    emi: EMIAssessment;

    stressTest: StressTestResult;

    assumptions: string[];
}
