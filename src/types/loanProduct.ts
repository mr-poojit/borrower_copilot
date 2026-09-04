export type LoanProductType =
    | "personal"
    | "home"
    | "lap"
    | "gold"
    | "two-wheeler"
    | "business";

export interface LoanProduct {
    id: string;

    name: string;
    type: LoanProductType;

    minAmount: number;
    maxAmount: number;

    minTenureMonths: number;
    maxTenureMonths: number;

    rateMin: number;
    rateMax: number;

    processingFeePercent: number;

    secured: boolean;

    suitableFor: string[];

    notes?: string;
}