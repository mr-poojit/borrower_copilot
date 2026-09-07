import { AssessmentResult } from "../types";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { formatINR, formatPct } from "../lib/format";

interface ResultsProps {
  result: AssessmentResult;
  onNavigateToNegotiation: () => void;
  onReevaluate: () => void;
}

export function Results({ result, onNavigateToNegotiation, onReevaluate }: ResultsProps) {
  const decisionVariant =
    result.decision === "borrow" ? "success" : result.decision === "borrow-less" ? "warning" : "danger";
  const confVariant =
    result.confidence === "high" ? "success" : result.confidence === "medium" ? "warning" : "danger";

  return (
    <div className="page-mid stack">
      <div className="card split-head">
        <div>
          <p className="kicker">Self-assessment · not a sanction</p>
          <h2 className="h2">Your four numbers</h2>
        </div>
        <div className="row-gap">
          <Badge variant={decisionVariant}>{result.decisionLabel}</Badge>
          <Badge variant={confVariant}>{result.confidence} confidence</Badge>
        </div>
      </div>

      <div
        className="card"
        style={{
          borderLeft: `4px solid ${
            result.decision === "borrow" ? "#10b981" : result.decision === "borrow-less" ? "#f59e0b" : "#ef4444"
          }`,
        }}
      >
        <h3 className="h3">O1 · Should you borrow?</h3>
        <p className="body">{result.decisionReason}</p>
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Product: <strong>{result.product.name}</strong> — {result.product.reason}
        </p>
      </div>

      <div className="two-col">
        <div className="card">
          <p className="label-safe">O2 · Your number (use this)</p>
          <p className="big-num">{formatINR(result.amount.safeCarry)}</p>
          <p className="range">
            Band {formatINR(result.amount.safeCarryLow)} – {formatINR(result.amount.safeCarryHigh)}
          </p>
          <p className="muted">{result.amount.whySafeCarry}</p>
        </div>
        <div className="card">
          <p className="label-lender">O2 · Lender&apos;s likely sanction</p>
          <p className="big-num">{formatINR(result.amount.likelySanction)}</p>
          <p className="range">
            Band {formatINR(result.amount.likelySanctionLow)} – {formatINR(result.amount.likelySanctionHigh)}
          </p>
          <p className="muted">{result.amount.whySanction}</p>
        </div>
      </div>
      <p className="callout">{result.amount.whyUseThis}</p>

      <div className="two-col">
        <div className="card">
          <p className="label-rate">O3 · Fair rate (band, not a point)</p>
          <p className="big-num">
            {formatPct(result.rate.fairMin)} – {formatPct(result.rate.fairMax)}
          </p>
          <p className="range">
            All-in APR {formatPct(result.rate.aprMin)} – {formatPct(result.rate.aprMax)} including ~
            {result.rate.processingFeePercent}% fee + GST ({formatINR(result.rate.processingFeeWithGst)})
          </p>
          <p className="muted">{result.rate.why}</p>
          {result.theirOfferRate != null && (
            <p className="callout" style={{ marginTop: "0.75rem" }}>
              Their quote {formatPct(result.theirOfferRate)} vs this band.{" "}
              {result.theirOfferRate > result.rate.fairMax
                ? "Walk away or switch product — it is above fair."
                : "Inside or near the band."}
            </p>
          )}
        </div>
        <div className="card">
          <p className="label-emi">O4 · EMI ceiling</p>
          <p className="big-num">
            {formatINR(result.emi.recommendedEMI)}
            <span className="unit"> / mo</span>
          </p>
          <p className="range">Do not cross {formatINR(result.emi.maximumEMI)} · {result.emi.tenureMonths} months</p>
          <p className="muted">{result.emi.why}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="h3">Tenure trade-off</h3>
        <div className="tenure-table">
          {result.emi.tenureOptions.map((t) => (
            <div
              key={t.months}
              className={t.months === result.emi.tenureMonths ? "tenure-row on" : "tenure-row"}
            >
              <span>{t.months / 12} yr</span>
              <span>{formatINR(t.emi)}/mo</span>
              <span className="muted">interest {formatINR(t.totalInterest)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="split-head">
          <h3 className="h3">Stress · {result.stressTest.scenario}</h3>
          <Badge variant={result.stressTest.passes ? "success" : "danger"}>
            {result.stressTest.passes ? "Holds" : "Breaks"}
          </Badge>
        </div>
        <p className="body">{result.stressTest.explanation}</p>
      </div>

      <div className="card">
        <h3 className="h3">Confidence</h3>
        <p className="body">{result.confidenceReason}</p>
        {result.unknowns.length > 0 && (
          <ul className="plain-list">
            {result.unknowns.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        )}
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Guessing on purpose: {result.assumptions.join(" ")}
        </p>
      </div>

      <div className="nav-row">
        <Button variant="secondary" onClick={onReevaluate}>
          Change answers
        </Button>
        <Button variant="primary" onClick={onNavigateToNegotiation}>
          Negotiation card
        </Button>
      </div>
    </div>
  );
}
