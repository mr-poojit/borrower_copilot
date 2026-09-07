# Five-minute walkthrough

## Minute 0–1 — What this is

Open the app. No account. Three assignment people are on the home page so a reviewer does not have to type.

The job is not to approve loans. It is to make the borrower the best-informed person at the desk: **borrow / less / don't**, **their number vs the lender's number**, a **rate band plus APR**, an **EMI they will not cross**, and a **page they can hold up**.

## Minute 1–2 — Priya (happy file, still not a blank cheque)

Click **Priya**.

She looks prime: ₹1.1L, 780, one car loan. A lender FOIR at 50% will happily talk about **~₹12.5L**. The app still says **Borrow less** and **use ₹7.45L**, EMI **₹24,500**, fair **10.3–12.8%** (APR **11.9–14.4%** with fee+GST).

That gap **is** the product. Wedding spend is consumption. Rent is real. FOIR does not see rent. Open the card: "you may sanction 12.45L; I will not take it."

## Minute 2–3 — Ravi (routing is the insight)

Click **Ravi**.

He has no score. The app does **not** price him as 300. It sends him to **loan against property** because the shop is ₹45L unencumbered — unsecured personal would be the wrong room.

Lender view uses **ITR ₹4.2L**, not ₹60k cash: sanction **~₹15.7L**. Safe cash-flow view: **₹14.5L**, EMI **₹20,500** over 10 years, band **9.7–13.7%**. Confidence **medium** because the bureau is missing, and it says so.

If a DSAs quotes 18% "business loan", the card's job is to say: that is not the product.

## Minute 3–4 — Anita (don't is allowed)

Click **Anita**.

Bounce, three app loans at 30%+, two children, husband unemployed. **Don't borrow.** Safe amount **₹0**. A lender-style FOIR can still show **₹50,000** — that is the trap. Product advice is **two-wheeler later**, not another app personal loan.

This is the test that "don't" is reachable and still **actionable** (clear the 30% book, then a secured scooter).

## Minute 4–5 — Questions and rules

Start a blank assessment. Nine must questions, then a gate: estimate now (wide bands) or tighten. Skip is allowed; skipped fields do not silently become zero.

Every extra question is documented in RULES.md with **what number it moves**. A salaried path never asks for ITR. A kirana path never asks card utilisation.

`src/rules/constants.ts` is the file to change in the follow-up (FOIR, LTV, residual floor, rate tables). The UI only renders `assess()`.

---

## What I would build next

1. **Offer-vs-band on the card as a live APR input** — type their quote, see fee-inclusive APR immediately.
2. **Debt-replace mode for Anita** — "close 30% apps with a 16% two-wheeler of ₹80k" as a **later** scenario, gated on bounce cure, not a yes today.
3. **Pin-code / bank rate scrape, quarterly** — replace static bands with a dated table and a "as of" stamp.
4. **Vernacular + print-shop layout** — the card is already print-CSS; Kannada/Hindi would matter more than polish on the dark UI.
5. **Co-applicant as a first-class FOIR** — some banks take 100% of a salaried spouse on LAP; we take 80%.

## What I would cut

- Home-loan depth (none of the three need a 20-year housing engine).
- Gold as a full origination path unless informal/medical (kept only because it can reroute Anita-like files).
- "Negotiation scripts" as theatre — a stamp, four numbers, and walk-away lines are enough.
- Fake precision: rupee-level EMI, single-point "fair rate", confidence 87%.
- Login, bureau, backend.

## Follow-up (60 minutes)

Walk Priya end-to-end, then change **one constant** (example: salaried safe FOIR 35% → 40%, or LAP LTV 50% → 60%) in `src/rules/constants.ts` and re-click Priya/Ravi. Outputs move; copy stays generated from the engine.
