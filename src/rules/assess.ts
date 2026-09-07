import {
  AssessmentResult,
  BorrowerProfile,
  ConfidenceLevel,
  CreditScoreBand,
  IncomeType,
  LoanProductType,
} from "../types";
import { formatINR, formatPct, roundTo } from "../lib/format";
import {
  AMOUNT_STEP,
  AMOUNT_WIDEN,
  APP_LOAN_APR_FLAG,
  CO_APPLICANT_WEIGHT,
  CONFIDENCE_WIDEN,
  DEFAULT_TENURE,
  DOCUMENTED_INCOME_WEIGHT,
  EMI_STEP,
  FEE_MAX,
  FEE_MIN,
  INCOME_SHOCK,
  LENDER_FOIR,
  LTV,
  MAX_AGE_AT_MATURITY,
  MIN_NET_INCOME,
  PROCESSING_FEE,
  PRODUCTIVE_INCOME_WEIGHT,
  RATE_SHOCK_BPS,
  RESIDUAL_FLOOR_BASE,
  RESIDUAL_PER_DEPENDENT,
  SAFE_FOIR,
  STRESS_FOIR_CAP,
  TENURE_OPTIONS,
  UNDOCUMENTED_INCOME_WEIGHT_LENDER,
  VARIABLE_INCOME_HAIRCUT,
} from "./constants";
import { allInApr, calculateEMI, feeInclusive, principalFromEMI, totalInterest } from "./apr";
import { getProduct, rateBandFor } from "./products";

function roundAmount(n: number): number {
  return Math.max(0, roundTo(n, AMOUNT_STEP));
}

function roundEmi(n: number): number {
  return Math.max(0, roundTo(n, EMI_STEP));
}

function incomeForLender(p: BorrowerProfile): { amount: number; why: string } {
  const co = (p.coApplicantIncome ?? 0) * CO_APPLICANT_WEIGHT;
  if (p.incomeType === "self-employed" && p.documentedAnnualIncome && p.documentedAnnualIncome > 0) {
    const documentedMonthly = (p.documentedAnnualIncome / 12) * DOCUMENTED_INCOME_WEIGHT;
    const undocumented = Math.max(0, p.monthlyIncome - documentedMonthly);
    const used =
      documentedMonthly + undocumented * UNDOCUMENTED_INCOME_WEIGHT_LENDER + co;
    return {
      amount: used,
      why: `A lender will underwrite from documented income (${formatINR(documentedMonthly)}/mo from ITR), not cash sales. Co-applicant counted at ${Math.round(CO_APPLICANT_WEIGHT * 100)}%.`,
    };
  }
  const variable = p.variableIncomeShare ?? 0;
  const haircut = p.incomeType === "informal" ? variable * VARIABLE_INCOME_HAIRCUT : 0;
  const used = p.monthlyIncome * (1 - haircut) + co;
  return {
    amount: used,
    why:
      p.incomeType === "informal"
        ? `Variable share is haircut by ${(haircut * 100).toFixed(0)}% because a lender cannot bank on the top of a gig month.`
        : `Take-home pay plus ${Math.round(CO_APPLICANT_WEIGHT * 100)}% of co-applicant income.`,
  };
}

function incomeForBorrower(p: BorrowerProfile): { amount: number; why: string } {
  const co = (p.coApplicantIncome ?? 0) * CO_APPLICANT_WEIGHT;
  const variable = p.variableIncomeShare ?? 0;
  const haircut =
    p.incomeType === "informal" || p.incomeType === "self-employed"
      ? variable * VARIABLE_INCOME_HAIRCUT
      : 0;
  const base = p.monthlyIncome * (1 - haircut);
  const productive = (p.expectedAdditionalIncome ?? 0) * PRODUCTIVE_INCOME_WEIGHT;
  return {
    amount: base + co + productive,
    why: `Your safe view starts from typical monthly cash (not ITR), haircuts variable income, counts ${Math.round(CO_APPLICANT_WEIGHT * 100)}% of a co-applicant, and only ${Math.round(PRODUCTIVE_INCOME_WEIGHT * 100)}% of hoped-for extra earnings.`,
  };
}

function residualFloor(p: BorrowerProfile): number {
  return RESIDUAL_FLOOR_BASE + RESIDUAL_PER_DEPENDENT * (p.dependents ?? 0);
}

function foirCaps(p: BorrowerProfile): { safe: number; lender: number } {
  let safe = SAFE_FOIR[p.incomeType];
  let lender = LENDER_FOIR[p.incomeType];

  if (p.incomeStable === false) {
    safe -= 0.05;
    lender -= 0.05;
  }
  if ((p.employmentYears ?? 99) < 1 && p.incomeType === "salaried") {
    lender -= 0.05;
  }
  if ((p.businessYears ?? 99) < 3 && p.incomeType === "self-employed") {
    lender -= 0.08;
  }
  if ((p.missedPayments ?? 0) >= 1) {
    lender -= 0.1;
    safe -= 0.05;
  }
  if ((p.existingLoans ?? 0) >= 3) {
    safe -= 0.05;
  }
  if ((p.emergencySavingsMonths ?? 3) >= 0 && (p.emergencySavingsMonths ?? 3) < 1) {
    safe -= 0.05;
  }
  if ((p.cardUtilisation ?? 0) >= 0.7) {
    lender -= 0.03;
  }

  return {
    safe: Math.max(0.15, safe),
    lender: Math.max(0.2, lender),
  };
}

export function recommendProduct(p: BorrowerProfile): {
  type: LoanProductType;
  reason: string;
} {
  const requested = p.loanType;
  const hasProperty = (p.propertyValue ?? 0) >= 10_00_000;
  const lapCapacity = (p.propertyValue ?? 0) * LTV.lap;
  const goldCapacity = (p.goldValue ?? 0) * LTV.gold;

  if (p.loanPurpose === "home" || requested === "home") {
    return { type: "home", reason: "The purpose is a house, so a home loan is the cheapest matched product." };
  }

  if (requested === "gold" || goldCapacity >= p.requestedAmount) {
    if (requested === "gold" || (p.incomeType === "informal" && goldCapacity > 0)) {
      return { type: "gold", reason: "Gold can fund a short gap without a 3-year personal-loan EMI." };
    }
  }

  const vehiclePurpose = p.loanPurpose === "vehicle" || requested === "two-wheeler";
  if (vehiclePurpose && p.requestedAmount <= 3_50_000) {
    return {
      type: "two-wheeler",
      reason: "A two-wheeler loan is secured on the vehicle and is cheaper than an unsecured or app personal loan for the same scooter.",
    };
  }

  if (
    hasProperty &&
    lapCapacity >= Math.min(p.requestedAmount, 5_00_000) &&
    (p.incomeType === "self-employed" ||
      requested === "lap" ||
      p.loanPurpose === "business" ||
      p.requestedAmount >= 10_00_000)
  ) {
    return {
      type: "lap",
      reason: `Unencumbered property of ${formatINR(p.propertyValue ?? 0)} can support a loan against property (about ${Math.round(LTV.lap * 100)}% LTV) at a lower rate and longer tenure than unsecured credit.`,
    };
  }

  if (p.loanPurpose === "business" || requested === "business") {
    return {
      type: "business",
      reason: "Purpose is working capital or a business asset. Unsecured business loans cost more than LAP if you have property.",
    };
  }

  if (requested !== "unknown") {
    return {
      type: requested as LoanProductType,
      reason: "Using the product you said you are considering.",
    };
  }

  return {
    type: "personal",
    reason: "Defaulting to an unsecured personal loan because no matching security or asset purpose was given.",
  };
}

function capTenure(product: LoanProductType, age: number): number {
  const maxAge = MAX_AGE_AT_MATURITY[product] ?? 60;
  const monthsLeft = Math.max(12, (maxAge - age) * 12);
  const options = TENURE_OPTIONS[product] ?? [36];
  const preferred = DEFAULT_TENURE[product] ?? 36;
  const allowed = options.filter((m) => m <= monthsLeft);
  if (allowed.includes(preferred)) return preferred;
  return allowed[allowed.length - 1] ?? Math.min(preferred, monthsLeft);
}

function applyRateAdjustments(
  band: { min: number; max: number },
  p: BorrowerProfile,
  product: LoanProductType
): { min: number; max: number; notes: string[] } {
  let { min, max } = band;
  const notes: string[] = [];

  if (p.incomeType === "salaried" && (p.employmentYears ?? 0) >= 5) {
    min -= 0.25;
    max -= 0.25;
    notes.push("5+ years with the same employer trims the band by 0.25pp.");
  }
  if (p.incomeType === "self-employed" && (p.businessYears ?? 0) >= 10 && product === "lap") {
    min -= 0.35;
    max -= 0.35;
    notes.push("10+ years of business vintage trims a secured band by 0.35pp.");
  }
  if (p.incomeStable === false) {
    min += 0.5;
    max += 0.75;
    notes.push("Unstable income adds a pricing buffer.");
  }
  if ((p.missedPayments ?? 0) >= 1) {
    min += 2;
    max += 4;
    notes.push("A bounce in the last year is priced as recent delinquency.");
  }
  if ((p.cardUtilisation ?? 0) >= 0.7) {
    min += 0.5;
    max += 0.75;
    notes.push("High card utilisation is a bureau risk flag.");
  }
  if (p.incomeType === "informal" && product === "personal") {
    min += 2;
    max += 4;
    notes.push("Informal income on an unsecured product is priced like thin-file credit.");
  }

  min = Math.max(8, min);
  max = Math.max(min + 0.75, max);
  return { min, max, notes };
}

function confidenceOf(p: BorrowerProfile): { level: ConfidenceLevel; reason: string } {
  const u = new Set(p.unknownFields);
  let score = 80;
  if (p.creditScoreBand === "unknown" || u.has("creditScoreBand")) {
    score -= 20;
  }
  if (u.has("householdExpenses")) score -= 10;
  if (u.has("existingEMI")) score -= 12;
  if (p.incomeType === "self-employed" && !p.documentedAnnualIncome) score -= 12;
  if (p.incomeType === "informal" && p.variableIncomeShare == null) score -= 8;
  if (u.has("emergencySavingsMonths")) score -= 5;
  if ((p.missedPayments ?? 0) >= 1) score -= 5;
  score -= Math.min(15, p.unknownFields.length * 3);

  if (score >= 70) {
    return {
      level: "high",
      reason: "Most must-answers are known, including income, EMIs and a credit band. Ranges are still ranges — not a sanction letter.",
    };
  }
  if (score >= 50) {
    return {
      level: "medium",
      reason: "Some inputs are missing or estimated. Bands are wider on purpose. Answer the skipped questions to tighten them.",
    };
  }
  return {
    level: "low",
    reason: "Too much is unknown (often credit, documented income, or expenses). The engine will not pretend it has a tight number.",
  };
}

function widenAmount(mid: number, level: ConfidenceLevel): { low: number; high: number } {
  const w = AMOUNT_WIDEN[level];
  return {
    low: roundAmount(mid * (1 - w)),
    high: roundAmount(mid * (1 + w)),
  };
}

function widenRate(
  min: number,
  max: number,
  level: ConfidenceLevel,
  creditUnknown: boolean
): { min: number; max: number } {
  if (creditUnknown) {
    return { min, max };
  }
  const extra = CONFIDENCE_WIDEN[level] * 100;
  return { min: Math.max(8, min - extra), max: max + extra };
}

export function assess(p: BorrowerProfile): AssessmentResult {
  const { type: productType, reason: productReason } = recommendProduct(p);
  const product = getProduct(productType);
  const conf = confidenceOf(p);
  const lenderInc = incomeForLender(p);
  const borrowerInc = incomeForBorrower(p);
  const caps = foirCaps(p);
  const floor = residualFloor(p);
  const tenure = capTenure(productType, p.age);

  let band = applyRateAdjustments(
    rateBandFor(productType, p.creditScoreBand),
    p,
    productType
  );
  const rateShown = widenRate(band.min, band.max, conf.level, p.creditScoreBand === "unknown");
  const expectedRate = (rateShown.min + rateShown.max) / 2;
  const feePct = PROCESSING_FEE[productType];

  const lenderHeadroomEMI = Math.max(0, caps.lender * lenderInc.amount - p.existingEMI);
  const safeFoirEMI = Math.max(0, caps.safe * borrowerInc.amount - p.existingEMI);
  const residualEMI = Math.max(
    0,
    borrowerInc.amount - p.householdExpenses - p.existingEMI - floor
  );
  const safeNewEMI = Math.max(0, Math.min(safeFoirEMI, residualEMI));

  const ltvCap =
    productType === "lap"
      ? (p.propertyValue ?? 0) * LTV.lap
      : productType === "gold"
        ? (p.goldValue ?? 0) * LTV.gold
        : Infinity;

  const likelyRaw = Math.min(
    principalFromEMI(lenderHeadroomEMI, expectedRate, tenure),
    product.maxAmount,
    ltvCap
  );
  const safeRaw = Math.min(
    principalFromEMI(safeNewEMI, expectedRate, tenure),
    product.maxAmount,
    ltvCap
  );

  const likely = roundAmount(likelyRaw);
  const safe = roundAmount(safeRaw);
  const likelyBand = widenAmount(likely, conf.level);
  const safeBand = widenAmount(safe, conf.level);

  const existingFoir =
    lenderInc.amount > 0 ? p.existingEMI / lenderInc.amount : 1;

  const bounced = (p.missedPayments ?? 0) >= 1;
  const alreadyBroke =
    residualEMI <= 0 ||
    p.monthlyIncome < MIN_NET_INCOME ||
    existingFoir > caps.lender;

  let decision: AssessmentResult["decision"] = "borrow";
  let decisionLabel = "Borrow";
  let recommendedAmount = Math.min(p.requestedAmount, safe);
  let decisionReason = "";

  if (alreadyBroke || (bounced && productType === "personal")) {
    decision = "dont-borrow";
    decisionLabel = "Don't borrow";
    recommendedAmount = 0;
  } else if (bounced && p.incomeType === "informal") {
    decision = "dont-borrow";
    decisionLabel = "Don't borrow";
    recommendedAmount = 0;
  } else if (p.requestedAmount > safe + AMOUNT_STEP) {
    decision = "borrow-less";
    decisionLabel = "Borrow less";
    recommendedAmount = safe;
  } else if (p.loanPurpose === "personal" || p.loanPurpose === "other") {
    const foirIfTaken =
      borrowerInc.amount > 0
        ? (p.existingEMI + calculateEMI(p.requestedAmount, expectedRate, tenure)) /
          borrowerInc.amount
        : 1;
    if (foirIfTaken > caps.safe) {
      decision = "borrow-less";
      decisionLabel = "Borrow less";
      recommendedAmount = safe;
    }
  }

  recommendedAmount = roundAmount(recommendedAmount);
  if (decision !== "dont-borrow") {
    recommendedAmount = Math.min(recommendedAmount, likely);
    if (recommendedAmount < p.requestedAmount - AMOUNT_STEP) {
      decision = "borrow-less";
      decisionLabel = "Borrow less";
    }
    if (recommendedAmount <= 0) {
      decision = "dont-borrow";
      decisionLabel = "Don't borrow";
    }
  }

  let useAmount = decision === "dont-borrow" ? 0 : recommendedAmount;
  if (useAmount > 0 && safeNewEMI > 0) {
    useAmount = Math.min(useAmount, roundAmount(principalFromEMI(safeNewEMI, expectedRate, tenure)));
  }
  const maxEmi = roundEmi(safeNewEMI);
  const recommendedEMI = Math.min(
    roundEmi(calculateEMI(useAmount, expectedRate, tenure)),
    maxEmi || roundEmi(calculateEMI(useAmount, expectedRate, tenure))
  );

  const feeBase = decision === "dont-borrow" ? p.requestedAmount : useAmount || p.requestedAmount;
  const fee = feeInclusive(Math.max(feeBase, 1), feePct);
  const feeClamped = Math.min(FEE_MAX, Math.max(FEE_MIN, fee.fee));
  const apr = allInApr(Math.max(feeBase, 1), expectedRate, tenure, feePct);
  const aprMin = allInApr(Math.max(feeBase, 1), rateShown.min, tenure, feePct);
  const aprMax = allInApr(Math.max(feeBase, 1), rateShown.max, tenure, feePct);

  const tenureOptions = (TENURE_OPTIONS[productType] ?? [tenure]).map((months) => {
    const capped = Math.min(months, (MAX_AGE_AT_MATURITY[productType] - p.age) * 12);
    const m = Math.max(12, capped);
    const principal = useAmount > 0 ? useAmount : Math.min(p.requestedAmount, safe || likely);
    return {
      months: m,
      emi: roundEmi(calculateEMI(principal, expectedRate, m)),
      totalInterest: roundAmount(totalInterest(principal, expectedRate, m)),
    };
  });

  const stressRate = expectedRate + RATE_SHOCK_BPS / 100;
  const stressIncome = borrowerInc.amount * (1 - INCOME_SHOCK);
  const scenarioIsIncome = p.incomeType !== "salaried";
  const stressedEmi = calculateEMI(
    useAmount > 0 ? useAmount : Math.min(p.requestedAmount, likely),
    scenarioIsIncome ? expectedRate : stressRate,
    tenure
  );
  const incomeForStress = scenarioIsIncome ? stressIncome : borrowerInc.amount;
  const stressedObligation = p.existingEMI + stressedEmi;
  const stressedFOIR = incomeForStress > 0 ? stressedObligation / incomeForStress : 1;
  const remaining = incomeForStress - p.householdExpenses - stressedObligation;
  const stressPasses =
    decision === "dont-borrow"
      ? false
      : stressedFOIR <= STRESS_FOIR_CAP && remaining >= 0;

  if (decision === "borrow" && !stressPasses) {
    decision = "borrow-less";
    decisionLabel = "Borrow less";
    decisionReason = "";
  }

  if (decision === "dont-borrow") {
    if (p.monthlyIncome < MIN_NET_INCOME) {
      decisionReason = `Take-home pay is below ${formatINR(MIN_NET_INCOME)}. Almost all of it is survival spend; a new EMI would be a debt trap, not credit.`;
    } else if (bounced) {
      decisionReason = `A bounce last month means the current stack is already failing. Adding ${formatINR(p.requestedAmount)} — especially at app-loan rates above ${APP_LOAN_APR_FLAG}% — raises the chance of another default. Clear the ${formatINR(p.existingEMI)}/mo book first, then come back for a cheaper secured product.`;
    } else if (residualEMI <= 0) {
      decisionReason = `After rent, food and existing EMIs you do not have ${formatINR(floor)} left, which is the minimum buffer this model keeps (${formatINR(RESIDUAL_FLOOR_BASE)} plus ${formatINR(RESIDUAL_PER_DEPENDENT)} per dependent). There is no safe new EMI, even if an app lender would still disburse.`;
    } else {
      decisionReason = `Existing FOIR is already ${(existingFoir * 100).toFixed(0)}% on the income a lender will count. New debt would only refinance stress.`;
    }
  } else if (decision === "borrow-less") {
    decisionReason = !stressPasses
      ? `The headline amount fits a quiet month, but the stress case does not. Cap the loan at ${formatINR(safe)} and the EMI at ${formatINR(maxEmi)} so a ${scenarioIsIncome ? "15% income dip" : "+2pp rate move"} does not wipe the buffer.`
      : `You asked for ${formatINR(p.requestedAmount)}. A lender looking only at FOIR may still go up to about ${formatINR(likely)}, but your expenses and buffer only safely support ${formatINR(safe)}. Use the lower number.`;
  } else {
    decisionReason = `${formatINR(p.requestedAmount)} fits inside a ${formatPct(caps.safe * 100, 0)} safe FOIR and leaves about ${formatINR(Math.max(0, borrowerInc.amount - p.householdExpenses - p.existingEMI - recommendedEMI))} after living costs. Take it on ${product.name.toLowerCase()} terms, not a more expensive substitute.`;
  }

  const whichToUse: "safe" | "lender" = safe <= likely ? "safe" : "lender";
  const whyUseThis =
    likely > safe
      ? `Use ${formatINR(safe)} (what you can carry), not ${formatINR(likely)} (what a FOIR model might still print). The gap is living costs and a cash buffer that the lender's ratio ignores.`
      : `A lender looking at documents may not go beyond ${formatINR(likely)}, even if cash flow could service more. Ask for ${formatINR(Math.min(safe, likely, p.requestedAmount))}.`;

  const creditWhy =
    p.creditScoreBand === "unknown"
      ? `Credit score is unknown, so this is not scored as 300 — it is a wide ${formatPct(rateShown.min)}–${formatPct(rateShown.max)} band for ${product.name.toLowerCase()}.`
      : `For a ${p.creditScoreBand} bureau band on ${product.name.toLowerCase()}, advertised rates cluster in ${formatPct(rateShown.min)}–${formatPct(rateShown.max)}.`;

  const unknowns: string[] = [];
  if (p.creditScoreBand === "unknown") {
    unknowns.push("Unknown credit score widened the rate band. It was not treated as a 300.");
  }
  if (!p.documentedAnnualIncome && p.incomeType === "self-employed") {
    unknowns.push("No ITR figure, so the lender view cannot be separated cleanly from cash income.");
  }
  for (const f of p.unknownFields) {
    if (f === "householdExpenses") unknowns.push("Expenses unknown — residual cash may be overstated.");
    if (f === "existingEMI") unknowns.push("Existing EMIs unknown — FOIR may be understated.");
    if (f === "emergencySavingsMonths") unknowns.push("Savings unknown — not assumed to be zero months.");
  }

  const walkAwayRate = rateShown.max + 1;
  const walkAwayEMI = maxEmi;

  const incomeTypeLabel: Record<IncomeType, string> = {
    salaried: "salaried",
    "self-employed": "self-employed",
    informal: "informal / gig",
  };

  const negotiationBecause = [
    creditWhy,
    product.secured
      ? `The product should be ${product.name.toLowerCase()} (secured), not an unsecured personal rate card.`
      : `Unsecured ${product.name.toLowerCase()} for a ${incomeTypeLabel[p.incomeType]} profile.`,
    ...band.notes,
  ]
    .filter(Boolean)
    .join(" ");

  const assumptions = [
    `Safe FOIR ${formatPct(caps.safe * 100, 0)} on borrower income; lender FOIR ${formatPct(caps.lender * 100, 0)} on lender income.`,
    `Residual floor ${formatINR(floor)} after expenses and EMIs.`,
    `Rate shock +${RATE_SHOCK_BPS} bps; income shock −${formatPct(INCOME_SHOCK * 100, 0)}.`,
    `Processing fee ${formatPct(feePct * 100, 1)} + ${formatPct(18, 0)} GST, rolled into APR.`,
    p.creditScoreBand === "unknown"
      ? "Unknown bureau file ≠ subprime default score."
      : `Credit band ${p.creditScoreBand}.`,
    `Tenure ${tenure} months on ${product.name}.`,
  ];

  return {
    decision,
    decisionLabel,
    decisionReason,
    confidence: conf.level,
    confidenceReason: conf.reason,
    product: {
      requested: p.loanType === "unknown" ? "unknown" : (p.loanType as LoanProductType),
      recommended: productType,
      name: product.name,
      secured: product.secured,
      reason: productReason,
    },
    amount: {
      likelySanction: likely,
      likelySanctionLow: likelyBand.low,
      likelySanctionHigh: likelyBand.high,
      safeCarry: safe,
      safeCarryLow: safeBand.low,
      safeCarryHigh: safeBand.high,
      recommendedAmount: useAmount,
      whichToUse,
      whySanction: `${lenderInc.why} Headroom EMI ${formatINR(lenderHeadroomEMI)} at ${formatPct(caps.lender * 100, 0)} FOIR over ${tenure} months is about ${formatINR(likely)}.${Number.isFinite(ltvCap) && ltvCap < 1e12 ? ` Collateral LTV also caps this at ${formatINR(ltvCap)}.` : ""}`,
      whySafeCarry: `${borrowerInc.why} New EMI is the lower of ${formatPct(caps.safe * 100, 0)} FOIR (${formatINR(safeFoirEMI)}) and cash after expenses + ${formatINR(floor)} buffer (${formatINR(residualEMI)}). That EMI amortises to ${formatINR(safe)}.`,
      whyUseThis,
    },
    rate: {
      fairMin: roundTo(rateShown.min, 0.1),
      fairMax: roundTo(rateShown.max, 0.1),
      expectedRate: roundTo(expectedRate, 0.1),
      processingFeePercent: feePct * 100,
      processingFeeAmount: roundAmount(feeClamped),
      processingFeeWithGst: roundAmount(feeClamped * 1.18),
      apr: roundTo(apr, 0.1),
      aprMin: roundTo(aprMin, 0.1),
      aprMax: roundTo(aprMax, 0.1),
      why: `${creditWhy} Add ~${formatPct(feePct * 100, 1)} processing fee + GST and the all-in APR is about ${formatPct(aprMin)}–${formatPct(aprMax)}, which is the number to compare with the lender's quote.`,
    },
    emi: {
      recommendedEMI,
      maximumEMI: maxEmi,
      tenureMonths: tenure,
      totalInterest: roundAmount(totalInterest(useAmount, expectedRate, tenure)),
      tenureOptions,
      why: `Do not agree an EMI above ${formatINR(maxEmi)}. That ceiling is residual cash, not what a salesperson can 'fit' by stretching tenure. Longer tenure lowers EMI and raises total interest — the trade-off is on this page.`,
    },
    stressTest: {
      scenario: scenarioIsIncome
        ? `Income drops ${formatPct(INCOME_SHOCK * 100, 0)}`
        : `Rate rises ${RATE_SHOCK_BPS / 100}pp (floating-rate style shock)`,
      EMI: roundEmi(stressedEmi),
      remainingIncome: roundEmi(remaining),
      stressedFOIR,
      passes: stressPasses,
      explanation: scenarioIsIncome
        ? `If income falls ${formatPct(INCOME_SHOCK * 100, 0)} to ${formatINR(incomeForStress)}, EMI ${formatINR(stressedEmi)} plus existing ${formatINR(p.existingEMI)} is ${formatPct(stressedFOIR * 100, 0)} FOIR, leaving ${formatINR(remaining)} after expenses.`
        : `If the rate is ${formatPct(stressRate)} instead of ${formatPct(expectedRate)}, EMI becomes ${formatINR(stressedEmi)} (${formatPct(stressedFOIR * 100, 0)} FOIR), leaving ${formatINR(remaining)} after expenses.`,
    },
    assumptions,
    unknowns,
    walkAwayRate: roundTo(walkAwayRate, 0.1),
    walkAwayEMI: walkAwayEMI,
    negotiationBecause,
    theirOfferRate: p.offerRate,
  };
}

export function creditLabel(band: CreditScoreBand): string {
  if (band === "unknown") return "unknown (not scored as 300)";
  return band;
}
