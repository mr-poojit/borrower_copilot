import { useMemo, useState } from "react";
import { mustQuestions } from "../questions/mustQuestions";
import { additionalQuestions } from "../questions/additionalQuestions";
import { Question } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";
import { OptionChips } from "../components/ui/OptionChips";
import { UNKNOWN_SENTINEL } from "../rules/mapAnswers";

interface AssessmentProps {
  onComplete: (answers: Record<string, unknown>) => void;
  initialAnswers?: Record<string, unknown>;
}

type Phase = "must" | "gate" | "extra";

export function Assessment({ onComplete, initialAnswers }: AssessmentProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers ?? {});
  const [phase, setPhase] = useState<Phase>("must");
  const [index, setIndex] = useState(0);

  const extraVisible = useMemo(
    () => additionalQuestions.filter((q) => !q.showWhen || q.showWhen(answers)),
    [answers]
  );

  const queue = phase === "must" ? mustQuestions : extraVisible;
  const current: Question | undefined = queue[index];
  const totalMust = mustQuestions.length;
  const progress =
    phase === "must"
      ? ((index + 1) / (totalMust + extraVisible.length)) * 100
      : ((totalMust + index + 1) / (totalMust + extraVisible.length)) * 100;

  const setField = (field: string, val: unknown) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const value = current ? answers[current.field] : undefined;
  const hasValue =
    value !== undefined &&
    value !== "" &&
    value !== UNKNOWN_SENTINEL &&
    !(current?.type === "currency" && value === undefined);

  const goNextMust = () => {
    if (index < mustQuestions.length - 1) setIndex(index + 1);
    else setPhase("gate");
  };

  const goNextExtra = () => {
    if (index < extraVisible.length - 1) setIndex(index + 1);
    else onComplete(answers);
  };

  const skipExtra = () => {
    if (!current) return;
    setField(current.field, UNKNOWN_SENTINEL);
    goNextExtra();
  };

  if (phase === "gate") {
    return (
      <div className="page-narrow">
        <div className="card">
          <p className="kicker">Must questions done</p>
          <h2 className="h2">We can score this now, with wide bands.</h2>
          <p className="muted">
            A few more questions each move a number: documented income, property, bounces, dependents,
            savings. Skip any you do not know — unknown is not treated as zero.
          </p>
          <div className="row-gap" style={{ marginTop: "1.5rem" }}>
            <Button
              variant="primary"
              onClick={() => {
                setPhase("extra");
                setIndex(0);
              }}
            >
              Tighten the ranges
            </Button>
            <Button variant="secondary" onClick={() => onComplete(answers)}>
              See estimate now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="page-narrow">
        <div className="card">
          <h2 className="h2">No further questions apply.</h2>
          <Button variant="primary" onClick={() => onComplete(answers)}>
            See results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <div style={{ marginBottom: "1.25rem" }}>
        <div className="progress-meta">
          <span>
            {phase === "must" ? "Must" : "Tightening"} · {index + 1} of {queue.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="card">
        <h2 className="question-title">{current.title}</h2>
        {current.description && <p className="muted">{current.description}</p>}

        <div style={{ margin: "1.25rem 0" }}>
          {current.type === "select" && current.options ? (
            <OptionChips
              options={current.options}
              value={value as string | number | undefined}
              onChange={(v) => setField(current.field, v)}
            />
          ) : current.type === "boolean" ? (
            <OptionChips
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              value={value as boolean | undefined}
              onChange={(v) => setField(current.field, v)}
            />
          ) : (
            <Input
              type="number"
              prefixSymbol={current.type === "currency" ? "₹" : undefined}
              placeholder={current.type === "currency" ? "0" : ""}
              value={value === undefined || value === UNKNOWN_SENTINEL ? "" : String(value)}
              onChange={(e) => {
                const raw = e.target.value;
                setField(current.field, raw === "" ? undefined : Number(raw));
              }}
            />
          )}
        </div>

        {current.why && (
          <div className="why-box">
            <strong>Why this moves a number:</strong> {current.why}
          </div>
        )}

        <div className="nav-row">
          <Button
            variant="secondary"
            disabled={phase === "must" && index === 0}
            onClick={() => {
              if (index > 0) setIndex(index - 1);
              else if (phase === "extra") setPhase("gate");
            }}
          >
            Back
          </Button>
          <div className="row-gap">
            {phase === "extra" && current.skipAllowed && (
              <Button variant="outline" onClick={skipExtra}>
                Skip — keep the range wide
              </Button>
            )}
            <Button
              variant="primary"
              disabled={!hasValue && current.required !== false}
              onClick={() => {
                if (phase === "extra" && !hasValue) {
                  skipExtra();
                  return;
                }
                phase === "must" ? goNextMust() : goNextExtra();
              }}
            >
              {phase === "extra" && index === extraVisible.length - 1
                ? "See results"
                : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
