import { AssessmentResult } from "../types";
import { Button } from "../components/ui/Button";
import { formatINR, formatPct } from "../lib/format";

interface NegotiationProps {
  result: AssessmentResult;
  onBack: () => void;
}

export function Negotiation({ result, onBack }: NegotiationProps) {
  return (
    <div className="page-mid stack">
      <div className="print-hide nav-row">
        <Button variant="secondary" onClick={onBack}>
          Back to results
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          Print / save as PDF
        </Button>
      </div>

      <article className="nego-card">
        <header className="nego-head">
          <div>
            <p className="kicker">Borrower Copilot · negotiation card</p>
            <h1>I know my number before you quote yours.</h1>
          </div>
          <div className={`nego-stamp ${result.decision}`}>{result.decisionLabel}</div>
        </header>

        <p className="nego-because">{result.negotiationBecause}</p>

        <div className="nego-grid">
          <section>
            <h2>Ask for this product</h2>
            <p className="nego-value">{result.product.name}</p>
            <p>{result.product.reason}</p>
          </section>
          <section>
            <h2>Amount I will take</h2>
            <p className="nego-value">{formatINR(result.amount.recommendedAmount)}</p>
            <p>
              You may sanction up to {formatINR(result.amount.likelySanction)}. I will not take more
              than {formatINR(result.amount.safeCarry)}.
            </p>
          </section>
          <section>
            <h2>Fair rate for this profile</h2>
            <p className="nego-value">
              {formatPct(result.rate.fairMin)} – {formatPct(result.rate.fairMax)}
            </p>
            <p>
              All-in APR {formatPct(result.rate.aprMin)} – {formatPct(result.rate.aprMax)} after ~
              {result.rate.processingFeePercent}% processing fee + 18% GST.
              {result.theirOfferRate != null
                ? ` Your quote of ${formatPct(result.theirOfferRate)} is ${
                    result.theirOfferRate > result.rate.fairMax ? "above" : "inside"
                  } that band.`
                : ""}
            </p>
          </section>
          <section>
            <h2>EMI I will sign</h2>
            <p className="nego-value">{formatINR(result.emi.recommendedEMI)} / mo</p>
            <p>
              Ceiling {formatINR(result.emi.maximumEMI)} over {result.emi.tenureMonths} months.
              Walk away if EMI exceeds the ceiling even if tenure is stretched.
            </p>
          </section>
        </div>

        <section className="nego-walk">
          <h2>Walk away if</h2>
          <ul>
            <li>
              Headline rate above {formatPct(result.walkAwayRate)} on {result.product.name.toLowerCase()}
            </li>
            <li>EMI above {formatINR(result.walkAwayEMI)} for any tenure</li>
            <li>APR including fee, GST and insurance is not disclosed in writing</li>
            {result.decision === "dont-borrow" && (
              <li>Any new unsecured disbursal before existing bounces are cured</li>
            )}
          </ul>
        </section>

        <p className="nego-foot">
          This is a self-assessment from figures I provided. It is not a bureau pull or a promise of
          sanction. Confidence: {result.confidence}. {result.confidenceReason}
        </p>
      </article>
    </div>
  );
}
