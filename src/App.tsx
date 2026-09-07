import { useState } from "react";
import { Welcome } from "./pages/Welcome";
import { Assessment } from "./pages/Assessment";
import { Results } from "./pages/Results";
import { Negotiation } from "./pages/Negotiation";
import { AssessmentResult } from "./types";
import { assess, mapAnswers } from "./rules";
import { demoBorrowers } from "./demo/borrowers";

type Tab = "welcome" | "assessment" | "results" | "negotiation";

export function App() {
  const [tab, setTab] = useState<Tab>("welcome");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [seedAnswers, setSeedAnswers] = useState<Record<string, unknown> | undefined>();

  const finish = (answers: Record<string, unknown>) => {
    const profile = mapAnswers(answers);
    setResult(assess(profile));
    setTab("results");
  };

  const runDemo = (id: "priya" | "ravi" | "anita") => {
    const demo = demoBorrowers.find((d) => d.id === id)!;
    setSeedAnswers(demo.answers);
    finish(demo.answers);
  };

  const go = (next: Tab) => {
    if ((next === "results" || next === "negotiation") && !result) return;
    setTab(next);
  };

  return (
    <div className="app-shell">
      <header className="topbar print-hide">
        <div className="topbar-inner">
          <button type="button" className="brand" onClick={() => setTab("welcome")}>
            <span className="brand-mark">₹</span>
            Borrower Copilot
          </button>
          <nav className="tabs">
            {(
              [
                ["welcome", "Home"],
                ["assessment", "Questions"],
                ["results", "Results"],
                ["negotiation", "Card"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={tab === id ? "tab on" : "tab"}
                onClick={() => go(id)}
                disabled={(id === "results" || id === "negotiation") && !result}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {tab === "welcome" && <Welcome onStart={() => setTab("assessment")} onDemo={runDemo} />}
        {tab === "assessment" && (
          <Assessment
            key={seedAnswers ? JSON.stringify(seedAnswers) : "blank"}
            initialAnswers={seedAnswers}
            onComplete={finish}
          />
        )}
        {tab === "results" && result && (
          <Results
            result={result}
            onNavigateToNegotiation={() => setTab("negotiation")}
            onReevaluate={() => setTab("assessment")}
          />
        )}
        {tab === "negotiation" && result && (
          <Negotiation result={result} onBack={() => setTab("results")} />
        )}
      </main>
    </div>
  );
}

export default App;
