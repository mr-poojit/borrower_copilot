export type IncomeType =
    | "salaried"
    | "self-employed"
    | "informal";

export type CreditScoreBand =
    | "750+"
    | "700-749"
    | "650-699"
    | "below-650"
    | "unknown";

export interface BorrowerProfile {
    age: number;

    loanPurpose: string;
    loanType: string;
    requestedAmount: number;

    incomeType: IncomeType;
    monthlyIncome: number;

    documentedAnnualIncome?: number;

    existingEMI: number;
    householdExpenses: number;

    creditScore?: number;
    creditScoreBand: CreditScoreBand;

    emergencySavingsMonths?: number;

    // Salaried
    employmentYears?: number;
    incomeStable?: boolean;

    // Self-employed
    businessYears?: number;
    propertyValue?: number;

    // Existing debt
    existingLoans?: number;
    missedPayments?: number;

    // Income-producing loan
    expectedAdditionalIncome?: number;

    // Informal / variable income
    variableIncomeShare?: number;
}
