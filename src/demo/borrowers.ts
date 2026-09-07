import { mapAnswers } from "../rules/mapAnswers";
import { assess } from "../rules/assess";
import { AssessmentResult, BorrowerProfile } from "../types";

export interface DemoBorrower {
  id: "priya" | "ravi" | "anita";
  name: string;
  blurb: string;
  answers: Record<string, unknown>;
}

export const demoBorrowers: DemoBorrower[] = [
  {
    id: "priya",
    name: "Priya, 29 · Bengaluru",
    blurb: "Salaried MNC · ₹8L wedding personal loan",
    answers: {
      loanPurpose: "personal",
      requestedAmount: 8_00_000,
      loanType: "personal",
      incomeType: "salaried",
      monthlyIncome: 1_10_000,
      existingEMI: 14_000,
      householdExpenses: 50_000,
      age: 29,
      creditScoreBand: "750+",
      employmentYears: 5,
      incomeStable: true,
      cardUtilisation: 0.2,
      dependents: 0,
      emergencySavingsMonths: 4.5,
      missedPayments: 0,
      existingLoans: 1,
    },
  },
  {
    id: "ravi",
    name: "Ravi, 42 · Mysuru",
    blurb: "Kirana · ₹15L stock + vehicle, shop on books",
    answers: {
      loanPurpose: "business",
      requestedAmount: 15_00_000,
      loanType: "unknown",
      incomeType: "self-employed",
      monthlyIncome: 60_000,
      existingEMI: 0,
      householdExpenses: 28_000,
      age: 42,
      creditScoreBand: "unknown",
      businessYears: 14,
      documentedAnnualIncome: 4_20_000,
      propertyValue: 45_00_000,
      coApplicantIncome: 18_000,
      variableIncomeShare: 0.5,
      dependents: 0,
      emergencySavingsMonths: 2,
      expectedAdditionalIncome: 12_000,
    },
  },
  {
    id: "anita",
    name: "Anita, 35 · Hubballi",
    blurb: "Gig + tailoring · ₹1.5L e-scooter, app loans bouncing",
    answers: {
      loanPurpose: "vehicle",
      requestedAmount: 1_50_000,
      loanType: "personal",
      incomeType: "informal",
      monthlyIncome: 28_000,
      existingEMI: 5_000,
      householdExpenses: 22_000,
      age: 35,
      creditScoreBand: "unknown",
      variableIncomeShare: 0.5,
      dependents: 3,
      emergencySavingsMonths: 0.5,
      missedPayments: 1,
      existingLoans: 3,
      expectedAdditionalIncome: 10_000,
      goldValue: 0,
    },
  },
];

export function runDemo(id: DemoBorrower["id"]): {
  profile: BorrowerProfile;
  result: AssessmentResult;
  answers: Record<string, unknown>;
  asked: string[];
} {
  const demo = demoBorrowers.find((d) => d.id === id)!;
  const profile = mapAnswers(demo.answers);
  return {
    profile,
    result: assess(profile),
    answers: demo.answers,
    asked: Object.keys(demo.answers),
  };
}
