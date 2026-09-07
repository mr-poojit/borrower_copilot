import { additionalQuestions } from "../questions/additionalQuestions";
import { mustQuestions } from "../questions/mustQuestions";
import { demoBorrowers, runDemo } from "./borrowers";

function askedFor(answers: Record<string, unknown>): string[] {
  const extra = additionalQuestions
    .filter((q) => !q.showWhen || q.showWhen(answers))
    .map((q) => q.title);
  return [...mustQuestions.map((q) => q.title), ...extra];
}

for (const d of demoBorrowers) {
  const { result } = runDemo(d.id);
  console.log("\n========", d.name, "========");
  console.log("Asked:", askedFor(d.answers).join(" | "));
  console.log("O1", result.decisionLabel, result.decisionReason);
  console.log("Product", result.product.name, result.product.reason);
  console.log("O2 safe", result.amount.safeCarry, "lender", result.amount.likelySanction, "use", result.amount.recommendedAmount);
  console.log("O3", result.rate.fairMin, result.rate.fairMax, "APR", result.rate.aprMin, result.rate.aprMax);
  console.log("O4 emi", result.emi.recommendedEMI, "max", result.emi.maximumEMI, "ten", result.emi.tenureMonths);
  console.log("Stress", result.stressTest.scenario, result.stressTest.passes, result.stressTest.explanation);
  console.log("Conf", result.confidence, result.unknowns);
}
