/**
 * Single source of truth for every threshold the engine uses.
 * Keep in lockstep with RULES.md. Change a rule here in the follow-up.
 */

export const MIN_NET_INCOME = 15_000;

/** FOIR = (existing EMIs + proposed EMI) / monthly income used for that view. */
export const SAFE_FOIR = {
  salaried: 0.35,
  "self-employed": 0.3,
  informal: 0.25,
} as const;

export const LENDER_FOIR = {
  salaried: 0.5,
  "self-employed": 0.45,
  informal: 0.4,
} as const;

/** Cash the household should still have after expenses and all EMIs. */
export const RESIDUAL_FLOOR_BASE = 8_000;
export const RESIDUAL_PER_DEPENDENT = 2_500;

export const RATE_SHOCK_BPS = 200;
export const INCOME_SHOCK = 0.15;
export const STRESS_FOIR_CAP = 0.5;

export const PROCESSING_FEE = {
  personal: 0.02,
  home: 0.005,
  lap: 0.01,
  gold: 0.01,
  "two-wheeler": 0.015,
  business: 0.02,
} as const;

export const GST_ON_FEES = 0.18;
export const FEE_MIN = 1_000;
export const FEE_MAX = 25_000;

export const LTV = {
  lap: 0.5,
  home: 0.8,
  gold: 0.75,
  "two-wheeler": 0.9,
} as const;

export const DEFAULT_TENURE: Record<string, number> = {
  personal: 36,
  home: 240,
  lap: 120,
  gold: 12,
  "two-wheeler": 36,
  business: 60,
};

export const TENURE_OPTIONS: Record<string, number[]> = {
  personal: [24, 36, 48, 60],
  home: [120, 180, 240, 300],
  lap: [60, 84, 120, 180],
  gold: [6, 12, 24],
  "two-wheeler": [24, 36, 48],
  business: [36, 48, 60, 84],
};

export const MAX_AGE_AT_MATURITY: Record<string, number> = {
  personal: 60,
  home: 70,
  lap: 70,
  gold: 70,
  "two-wheeler": 65,
  business: 65,
};

/** Unsecured personal / business headline bands by credit. Unknown is not 300. */
export const UNSECURED_RATE_BAND: Record<
  string,
  { min: number; max: number }
> = {
  "750+": { min: 10.5, max: 13.0 },
  "700-749": { min: 13.0, max: 16.0 },
  "650-699": { min: 16.0, max: 20.0 },
  "below-650": { min: 20.0, max: 28.0 },
  unknown: { min: 13.0, max: 22.0 },
};

export const LAP_RATE_BAND: Record<string, { min: number; max: number }> = {
  "750+": { min: 9.25, max: 11.0 },
  "700-749": { min: 10.0, max: 12.0 },
  "650-699": { min: 11.0, max: 13.5 },
  "below-650": { min: 12.5, max: 16.0 },
  unknown: { min: 10.0, max: 14.0 },
};

export const HOME_RATE_BAND: Record<string, { min: number; max: number }> = {
  "750+": { min: 8.4, max: 9.3 },
  "700-749": { min: 8.7, max: 9.8 },
  "650-699": { min: 9.3, max: 10.8 },
  "below-650": { min: 10.5, max: 12.5 },
  unknown: { min: 8.7, max: 11.0 },
};

export const GOLD_RATE_BAND: Record<string, { min: number; max: number }> = {
  "750+": { min: 9.0, max: 12.0 },
  "700-749": { min: 9.5, max: 13.0 },
  "650-699": { min: 10.5, max: 14.0 },
  "below-650": { min: 11.0, max: 16.0 },
  unknown: { min: 9.5, max: 15.0 },
};

export const TWO_WHEELER_RATE_BAND: Record<
  string,
  { min: number; max: number }
> = {
  "750+": { min: 10.5, max: 13.5 },
  "700-749": { min: 12.0, max: 15.5 },
  "650-699": { min: 14.0, max: 18.0 },
  "below-650": { min: 16.0, max: 22.0 },
  unknown: { min: 12.0, max: 18.0 },
};

export const BUSINESS_UNSECURED_RATE_BAND: Record<
  string,
  { min: number; max: number }
> = {
  "750+": { min: 14.0, max: 18.0 },
  "700-749": { min: 16.0, max: 20.0 },
  "650-699": { min: 18.0, max: 24.0 },
  "below-650": { min: 22.0, max: 30.0 },
  unknown: { min: 16.0, max: 26.0 },
};

export const APP_LOAN_APR_FLAG = 24;

export const DOCUMENTED_INCOME_WEIGHT = 1;
export const UNDOCUMENTED_INCOME_WEIGHT_LENDER = 0;
export const CO_APPLICANT_WEIGHT = 0.8;
export const PRODUCTIVE_INCOME_WEIGHT = 0.5;
export const VARIABLE_INCOME_HAIRCUT = 0.4;

export const CONFIDENCE_WIDEN = {
  high: 0,
  medium: 0.015,
  low: 0.03,
} as const;

export const AMOUNT_WIDEN = {
  high: 0.05,
  medium: 0.12,
  low: 0.22,
} as const;

export const HIGH_COST_DEBT_APR = 24;
export const AMOUNT_STEP = 5_000;
export const EMI_STEP = 100;
