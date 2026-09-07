# Borrower Copilot

A browser-only self-assessment for an Indian borrower: **should I borrow, how much, at what rate, at what EMI** — then a one-page card to take into the branch.

No login, no bureau, no server, nothing stored.

## Run locally (under 5 minutes)

Need **Node 18+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Optional:

```bash
npm run build      # production bundle
npm run preview    # serve the bundle
npx tsx src/demo/printScenarios.ts   # Priya / Ravi / Anita numbers in the terminal
```

## What to click

1. **Answer a few questions** — 9 must-questions, then optional tightening questions (skip any; unknown is not zero).
2. Or use the three assignment profiles on the home page: **Priya**, **Ravi**, **Anita**.
3. **Results** — four outputs, two amount numbers, rate **band**, APR including fee+GST, tenure trade-off, one stress case.
4. **Card** — print / save as PDF for the lender.

Rules engine is in `src/rules/` (`constants.ts` is the follow-up file). UI does not embed thresholds.

## Deliverables

| File | What |
| :--- | :--- |
| This README | How to run |
| [RULES.md](./RULES.md) | Every threshold, why, source or judgement |
| [RUNTHROUGHS.md](./RUNTHROUGHS.md) | Priya, Ravi, Anita: questions, four outputs, card |
| [WALKTHROUGH.md](./WALKTHROUGH.md) | Five-minute written walkthrough, what to build next, what to cut |
