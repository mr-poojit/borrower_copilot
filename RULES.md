# RULES.md

Every knob the engine uses lives in `src/rules/constants.ts`. Change a number there in the follow-up; the UI only prints what the engine returns.

This is a borrower self-assessment, not a credit model. It does not pull a bureau, store data, or promise a sanction.

---

## How the four outputs are produced

| Output | What the engine does |
| :--- | :--- |
| O1 Borrow / Borrow less / Don't | Decision tree on residual cash, existing FOIR, bounces, requested vs safe amount, then a stress test. "Don't" is reachable (Anita). |
| O2 Two amounts | **Lender likely sanction** = FOIR on *lender income* (ITR for self-employed; cash ignored), capped by product max and LTV. **Safe carry** = min(safe FOIR on *borrower cash income*, leftover after expenses and a residual floor), same LTV cap. Recommended ask = min(requested, safe, lender). |
| O3 Fair rate band + APR | Product + credit band table, then small adjustments (vintage, bounce, utilisation, informal-on-unsecured). Unknown credit uses a **wide** table — never score 300. APR is IRR on net disbursement after fee + GST. |
| O4 EMI ceiling + tenure | EMI on the recommended amount at the band midpoint, default tenure by product. Ceiling = the safe new-EMI rupees. Tenure table shows the EMI vs total-interest trade-off. One stress case: +200 bps if salaried, −15% income otherwise. |

The borrower is told to use the **lower** of the two O2 numbers. Lenders ignore household expenses; the household should not.

---

## 1. Affordability (FOIR + residual)

FOIR = (existing EMIs + proposed EMI) / income used for that view.

| What | Value | Why | Source or judgement |
| :--- | :--- | :--- | :--- |
| Safe FOIR, salaried | 35% | Leaves room for rent, food, and a buffer. Banks will go higher; the borrower should not. | FPSB-style planning / my judgement. Retail FOIR "max" is not a household safe level. |
| Safe FOIR, self-employed | 30% | Cash months are lumpy; ITR is smoother than the till. | My judgement. |
| Safe FOIR, informal / gig | 25% | Highest month-to-month variance. | My judgement. |
| Lender FOIR, salaried | 50% | Common private-bank personal-loan cap for salaried with a bureau. | Industry practice (HDFC / ICICI / SBI retail grids, 2024–26). |
| Lender FOIR, self-employed | 45% | Tighter because income is assessed from ITR/banking, not verbal cash. | Industry practice. |
| Lender FOIR, informal | 40% | Many NBFCs/fintechs still originate here; it is not the same as "safe". | Fintech / NBFC practice. |
| Minimum net income | ₹15,000 / month | Below this, survival spend eats the file. New EMI is a trap. | My judgement, informed by RBI financial-inclusion discussion of thin surplus households. |
| Residual floor | ₹8,000 after expenses **and** all EMIs | FOIR of 40% on ₹28,000 still leaves a family of four with nothing. Residual is the second constraint. | My judgement. |
| Extra residual per dependent | ₹2,500 | Two children plus an unemployed spouse are not a "single" surplus. | My judgement. |
| Amount rounding | ₹5,000 | Avoid fake rupee precision. | My judgement. |
| EMI rounding | ₹100 | Same. | My judgement. |

**Lender income vs borrower income (this is the whole product):**

| View | Income used | Why |
| :--- | :--- | :--- |
| Lender | Salaried: stated take-home. Self-employed: ITR/12 only (cash above ITR weight = 0). Informal: stated × (1 − 0.4 × variable share). Plus 80% of co-applicant. | Banks underwrite paper. Kirana cash that is not in the ITR does not raise sanction in this model. |
| Borrower (safe) | Typical monthly cash, haircut for variable share, 80% co-applicant, **50%** of hoped-for extra income from this loan. ITR is **not** used to shrink cash. | The household actually spends from the till. Optimism on "the scooter will double orders" is halved so it cannot carry the file alone. |

---

## 2. Product routing and LTV

| What | Value | Why | Source or judgement |
| :--- | :--- | :--- | :--- |
| Default if purpose = house | Home loan | Cheapest matched product. | Obvious. |
| Vehicle purpose and amount ≤ ₹3.5L | Two-wheeler loan | Asset-backed, cheaper than app personal. | OEM/NBFC two-wheeler grids. |
| Self-employed (or business purpose) with pledgeable property | LAP | Ravi must not stay on unsecured personal. 14-year shop + unencumbered premises is a classic LAP file. | My judgement + LAP product design. |
| Gold pledged | Gold loan, 75% LTV | RBI gold-loan LTV cap (regulatory). | RBI gold loan guidelines (LTV 75%). |
| LAP LTV | 50% of stated property value | Commercial/shop premises are not 80% residential home-loan LTV. 40–60% is the range I have seen; 50% is the midpoint. | My judgement. |
| Home LTV | 80% | Standard home-loan cap (CIBIL/regulatory practice). | Industry practice. |
| Two-wheeler LTV | 90% | Common on-road funding. Not the binding cap when the user states loan amount, not on-road price. | Industry practice. |
| Unsecured business (no property / property not pledged) | Business loan rate card | Higher than LAP. | NBFC MSME unsecured grids. |

Product min/max amount and tenure live in `src/rules/products.ts`.

---

## 3. Tenure

| Product | Default | Options (months) | Max age at maturity | Why |
| :--- | :--- | :--- | :--- | :--- |
| Personal | 36 | 24, 36, 48, 60 | 60 | Typical PL. Stretching to 60 hides EMI and raises interest. |
| LAP | 120 | 60, 84, 120, 180 | 70 | Cash-flow for a shop is a 7–15 year problem, not a 3-year personal loan. |
| Home | 240 | 120–300 | 70 | Standard. |
| Gold | 12 | 6, 12, 24 | 70 | Bridge, not a 5-year obligation. |
| Two-wheeler | 36 | 24, 36, 48 | 65 | Asset life. |
| Business unsecured | 60 | 36–84 | 65 | Shorter than LAP. |

If age would breach max-at-maturity, tenure is cut.

---

## 4. Headline rate bands (before adjustments)

Bands are **what a borrower should expect to be quoted**, not a promise. Sources: public 2025–26 retail rate cards (SBI/HDFC/ICICI personal and mortgage; Bajaj/Tata Capital/NBFC MSME; bank and NBFC gold; OEM two-wheeler). Edges are my judgement where public cards disagree.

### Personal (unsecured)

| Credit band | Rate (% p.a.) |
| :--- | :--- |
| 750+ | 10.5 – 13.0 |
| 700–749 | 13.0 – 16.0 |
| 650–699 | 16.0 – 20.0 |
| Below 650 | 20.0 – 28.0 |
| **Unknown** | **13.0 – 22.0** (not 300, not 750) |

### LAP

| Credit band | Rate (% p.a.) |
| :--- | :--- |
| 750+ | 9.25 – 11.0 |
| 700–749 | 10.0 – 12.0 |
| 650–699 | 11.0 – 13.5 |
| Below 650 | 12.5 – 16.0 |
| Unknown | 10.0 – 14.0 |

### Home / gold / two-wheeler / unsecured business

See `HOME_RATE_BAND`, `GOLD_RATE_BAND`, `TWO_WHEELER_RATE_BAND`, `BUSINESS_UNSECURED_RATE_BAND` in `constants.ts`. Same unknown-is-not-zero pattern.

### Adjustments (my judgement)

| Condition | Effect |
| :--- | :--- |
| Salaried, 5+ years with employer | −0.25 pp both ends |
| Self-employed, 10+ years vintage, on LAP | −0.35 pp |
| Income not stable | +0.50 / +0.75 pp |
| ≥1 bounce in 12 months | +2 / +4 pp |
| Card utilisation ≥ 70% | +0.50 / +0.75 pp |
| Informal income on **personal** (unsecured) | +2 / +4 pp |
| Employment < 1 year | Lender FOIR −5 pp |
| Business vintage < 3 years | Lender FOIR −8 pp |
| Bounce | Lender FOIR −10 pp, safe FOIR −5 pp |
| ≥3 live loans | Safe FOIR −5 pp |
| Savings < 1 month of expenses | Safe FOIR −5 pp |
| Unstable income | Both FOIRs −5 pp |
| High utilisation | Lender FOIR −3 pp |

Unknown credit **does not** get a second widening on top of the unknown table. Missing *other* fields still widen **amount** bands (below).

---

## 5. Fees and all-in APR

| What | Value | Why | Source or judgement |
| :--- | :--- | :--- | :--- |
| Processing fee, personal / unsecured business | 2.0% | Mid of the 1–3% street range. | Typical PL/BL fee cards. |
| LAP | 1.0% | Secured files are cheaper to originate. | Typical. |
| Home | 0.5% | Often capped or waived; 0.5% is a working default. | Typical. |
| Gold | 1.0% | | Typical. |
| Two-wheeler | 1.5% | | Typical. |
| GST on fees | 18% | Statutory. | GST Act. |
| Fee floor / cap in display | ₹1,000 / ₹25,000 | Stops nonsense on tiny/huge principals. | My judgement. |
| APR | Monthly IRR on **net** amount received (principal − fee − GST), paid back as the contractual EMI, then × 12. | Spirit of RBI all-in cost disclosure for digital lending (RBI/2022-23/111 and later FAQs). We do **not** model stamp, insurance, or CIBIL enquiry fees. | RBI + my implementation. |
| Insurance | **Not included** | Often bundled and optional; including a fake 1% would look precise and be wrong. The card tells the borrower to ask. | Honesty. |

Walk-away headline rate = top of fair band + 1 pp.

App-loan warning flag = 24% APR. Anita's 30%+ book is above this.

---

## 6. Confidence and silence

| Level | When | Amount band | Rate |
| :--- | :--- | :--- | :--- |
| High | Score ≥ 70 (must answers + known bureau band) | ±5% | No extra widen |
| Medium | 50–69 (typical: unknown bureau, or several skips) | ±12% | +1.5 pp each side **only if credit is known** |
| Low | < 50 | ±22% | +3.0 pp each side **only if credit is known** |

Unknown credit already has a 4–9 pp table width. Stacking another widen produced 8–15% LAP bands that looked like a bug, not honesty.

| Silence | What we do **not** do |
| :--- | :--- |
| "I don't know my score" | Not 300, not 750. Wide product table. |
| Unknown savings | Not zero months. No −5 pp FOIR haircut. |
| Skipped additional | That adjustment is off. Range stays wide. Amount band still widens with skip count. |
| Blank expenses / EMIs | Treated as 0 **and** flagged as unknown so leftover cash may be overstated. |

---

## 7. Decision matrix

| Decision | Fires when |
| :--- | :--- |
| **Don't borrow** | Residual new-EMI ≤ 0, **or** income < ₹15,000, **or** existing FOIR already above lender cap, **or** a bounce on informal income, **or** a bounce while the product is unsecured personal. |
| **Borrow less** | Requested > safe carry (+ ₹5,000), **or** consumption loan pushes FOIR above safe, **or** stress fails (then we still cap at safe), **or** lender likely < requested. |
| **Borrow** | Requested fits safe and lender, stress holds, no bounce trigger. |

Stress **may use the cash buffer**. Origination requires leftover ≥ residual floor. After a shock, pass = FOIR ≤ 50% **and leftover ≥ 0**. A buffer that cannot be touched is not a buffer.

| Shock | Who | Why |
| :--- | :--- | :--- |
| +200 bps rate | Salaried (floating-style) | Repo cycles on PL/HL/LAP. |
| −15% income | Self-employed and informal | Till / gig hours drop. Rate shock is the wrong story for cash income. |

---

## 8. Additional questions — each must move a number

Must set (9): purpose, amount, product, income type, take-home, existing EMIs, household spend, age, credit band (incl. unknown).

| Question | Shown when | What it moves |
| :--- | :--- | :--- |
| Employer years | Salaried | Rate (−0.25 if ≥5); lender FOIR if <1 |
| Income stable | Salaried | FOIR −5 pp and rate up if no |
| Card utilisation | Salaried **and** score known | Rate and lender FOIR if ≥70% |
| Business years | Self-employed | Lender FOIR if <3; LAP rate if ≥10 |
| ITR | Self-employed | Lender amount (cash above ITR ignored) |
| Property value | SE / business / LAP | Product → LAP; amount capped at 50% LTV |
| Co-applicant income | SE or informal | Both incomes × 80% |
| Variable share | SE or informal | Income haircut 40% × share |
| Dependents | Everyone | Residual floor |
| Emergency savings | Everyone | Safe FOIR if <1 month; unknown ≠ 0 |
| Bounces | Informal **or** EMI > 0 | Can force Don't; reprice |
| Live loan count | EMI > 0 | Safe FOIR if ≥3 |
| Extra income from loan | Business or vehicle purpose | +50% to **borrower** income only |
| Gold value | Gold product, informal, or medical | Product / 75% LTV |
| Offer already in hand | Everyone | Does not move O1–O4. Printed on the **card** vs our APR. Skip if none. |

A salaried engineer does not see ITR, shop value, or variable-share. A kirana owner does not see card utilisation. That is the adaptive path.

---

## 9. What this app does not know

| Limit | What we did instead |
| :--- | :--- |
| Live rate cards by pin code and employer | Static bands, dated as 2025–26 public cards + judgement. |
| Actual bureau, FOIR at the lender, banking analysis | User-stated figures only. |
| City-level inflation / rent | Expenses are asked; we did not invent a Bengaluru multiplier on top of Priya's rent. |
| Insurance, stamp, foreclosure, reset clauses | APR is fee+GST only. Card tells you to ask. |
| Whether the shop title is clean, or gold is hallmarked | Stated value × LTV. |
| Tax on co-applicant, FOIR combining rules per bank | Flat 80% add. |
| Anita's true app-loan EMI | Brief gave ₹35,000 outstanding at 30%+. Demo uses **₹5,000/month** as a working EMI. |
| Priya's non-rent spend | Brief gave rent ₹28,000. Demo uses **₹50,000** household (rent + ~₹22,000 other). |
| Ravi's "usual" month | Brief gave ₹40,000–80,000 cash. Demo uses **₹60,000** midpoint. |
| Whether productive income arrives | Half-weight only; lenders get 0 until it is in the bank. |

If a range is tight, it is because the user answered. If they skipped, the app says so.
