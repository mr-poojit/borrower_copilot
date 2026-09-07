import { LoanProduct, LoanProductType } from "../types";
import {
  BUSINESS_UNSECURED_RATE_BAND,
  GOLD_RATE_BAND,
  HOME_RATE_BAND,
  LAP_RATE_BAND,
  PROCESSING_FEE,
  TWO_WHEELER_RATE_BAND,
  UNSECURED_RATE_BAND,
} from "./constants";

export const PRODUCTS: LoanProduct[] = [
  {
    id: "personal",
    name: "Personal loan",
    type: "personal",
    minAmount: 50_000,
    maxAmount: 40_00_000,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    rateMin: 10.5,
    rateMax: 28,
    processingFeePercent: PROCESSING_FEE.personal * 100,
    secured: false,
    suitableFor: ["salaried", "personal", "wedding", "medical", "education"],
    notes: "Unsecured. Priced on bureau + FOIR. Fastest to take, easiest to overpay.",
  },
  {
    id: "lap",
    name: "Loan against property",
    type: "lap",
    minAmount: 5_00_000,
    maxAmount: 5_00_00_000,
    minTenureMonths: 36,
    maxTenureMonths: 180,
    rateMin: 9.25,
    rateMax: 16,
    processingFeePercent: PROCESSING_FEE.lap * 100,
    secured: true,
    suitableFor: ["self-employed", "business", "top-up"],
    notes: "Shop or house as security. Lower rate and longer tenure than unsecured business credit.",
  },
  {
    id: "business",
    name: "Unsecured business loan",
    type: "business",
    minAmount: 1_00_000,
    maxAmount: 50_00_000,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    rateMin: 14,
    rateMax: 30,
    processingFeePercent: PROCESSING_FEE.business * 100,
    secured: false,
    suitableFor: ["self-employed", "business"],
    notes: "ITR and banking are the lender's income. Cash sales without documents do not fully count.",
  },
  {
    id: "two-wheeler",
    name: "Two-wheeler loan",
    type: "two-wheeler",
    minAmount: 30_000,
    maxAmount: 3_50_000,
    minTenureMonths: 12,
    maxTenureMonths: 48,
    rateMin: 10.5,
    rateMax: 22,
    processingFeePercent: PROCESSING_FEE["two-wheeler"] * 100,
    secured: true,
    suitableFor: ["vehicle", "informal", "gig"],
    notes: "The vehicle is the security. Cheaper than an app personal loan for the same scooter.",
  },
  {
    id: "gold",
    name: "Gold loan",
    type: "gold",
    minAmount: 10_000,
    maxAmount: 50_00_000,
    minTenureMonths: 6,
    maxTenureMonths: 24,
    rateMin: 9,
    rateMax: 16,
    processingFeePercent: PROCESSING_FEE.gold * 100,
    secured: true,
    suitableFor: ["emergency", "informal", "short-tenure"],
    notes: "LTV capped. Useful bridge, not a 5-year obligation.",
  },
  {
    id: "home",
    name: "Home loan",
    type: "home",
    minAmount: 5_00_000,
    maxAmount: 10_00_00_000,
    minTenureMonths: 60,
    maxTenureMonths: 360,
    rateMin: 8.4,
    rateMax: 12.5,
    processingFeePercent: PROCESSING_FEE.home * 100,
    secured: true,
    suitableFor: ["home"],
    notes: "Cheapest formal credit if the purpose is actually a house.",
  },
];

export function getProduct(type: LoanProductType): LoanProduct {
  return PRODUCTS.find((p) => p.type === type) ?? PRODUCTS[0];
}

export function rateBandFor(
  type: LoanProductType,
  credit: string
): { min: number; max: number } {
  const table =
    type === "lap"
      ? LAP_RATE_BAND
      : type === "home"
        ? HOME_RATE_BAND
        : type === "gold"
          ? GOLD_RATE_BAND
          : type === "two-wheeler"
            ? TWO_WHEELER_RATE_BAND
            : type === "business"
              ? BUSINESS_UNSECURED_RATE_BAND
              : UNSECURED_RATE_BAND;
  return table[credit] ?? table.unknown;
}
