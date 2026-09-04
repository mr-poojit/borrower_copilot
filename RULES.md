# Borrower Copilot — Financial Rules & Underwriting Assumptions

This document establishes and justifies all financial constants, underwriting formulas, regulatory disclosures, and risk management parameters used in **Borrower Copilot**. Every rule is explicitly backed by regulatory guidelines, industry banking benchmarks in India, or documented financial engineering judgement.

---

## 1. Affordability Rules (FOIR Framework)

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Safe FOIR Threshold** | **35% - 40%** of Gross Monthly Income | Keeping total monthly debt obligations (existing EMIs + proposed EMI) below 40% ensures the borrower retains sufficient cashflow for essential living expenses, inflation, and emergency savings. | **FPSB India** (Financial Planning Standards Board) & Personal Finance Best Practices |
| **Max Lender FOIR Limit** | **50%** of Gross Monthly Income (Salaried)<br>**45%** (Self-Employed / Informal) | Commercial banks and NBFCs push debt tolerance to 50% for salaried individuals with stable income, but reduce it for self-employed/informal profiles due to income volatility. | **Retail Banking Underwriting Manuals** (HDFC Bank, ICICI Bank, SBI) |
| **Minimum Income Floor** | **₹15,000 / month** (Net) | Borrowers earning below ₹15,000/month consume over 80% of income on basic survival expenses (rent, food, utilities), leaving zero buffer for loan debt service. | **RBI Financial Inclusion Guidelines** & Statutory Minimum Wages Benchmarks |

---

## 2. Risk-Adjusted Interest Rate & Pricing Rules

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Tier 1 Prime Rate (CIBIL 775+)** | **10.50% - 11.50%** p.a. | High credit score indicates negligible historical default risk, qualifying for top-tier unsecured personal loan rates. | **Published Retail Loan Rate Cards** (SBI, HDFC Bank 2025-2026) |
| **Tier 2 Good Rate (CIBIL 725 - 774)** | **12.00% - 13.50%** p.a. | Standard risk profile representing low risk with occasional minor credit utilization spikes. | Industry Average Benchmark |
| **Tier 3 Average Rate (CIBIL 675 - 724)** | **14.00% - 16.50%** p.a. | Moderate risk tier requiring risk premium pricing to cover statistical probability of default. | NBFC Standard Rate Grid (Bajaj Finance, Tata Capital) |
| **Tier 4 High Risk / Unscored (<675 / Informal)** | **17.00% - 21.00%** p.a. | Subprime or unrated borrowers require higher risk-adjusted spreads due to lack of formal credit history or adverse payment records. | **RBI Digital Lending Guidelines** & Fintech Lending Benchmarks |

---

## 3. All-in APR (Annual Percentage Rate) Regulatory Rule

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Processing Fee Standard** | **1.50% - 2.50%** of Loan Principal (Min ₹1,000, Max ₹10,000) | Upfront administrative costs charged by lenders at disbursement. | Standard Indian Banking Practice |
| **Statutory GST on Fees** | **18.00%** GST on Processing Fees | Mandatory statutory tax applicable on banking services in India. | **Government of India GST Act** |
| **RBI All-in APR Formula** | $\text{APR} = \frac{\text{Total Interest} + \text{Processing Fee} + \text{GST} + \text{Insurance}}{\text{Principal}} \times \frac{365}{\text{Tenure Days}} \times 100$ | Mandated by RBI to prevent hidden charges by disclosing the true internal rate of return (IRR) / annualized cost of borrowing to retail consumers. | **RBI Circular on Regulatory Framework for Digital Lending** (RBI/2022-23/111) |

---

## 4. Interest Rate Stress Test (Rate Shock Rule)

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Rate Shock Delta** | **+2.00% (+200 bps)** Interest Rate Spike | Floating rate personal/home loans in India fluctuate with RBI Repo Rate cycles. A +2% rate shock evaluates if borrower's FOIR breaks beyond 55% during rate hike cycles. | **RBI Financial Stability Stress Test Framework** & My Judgement |
| **Income Shock Delta** | **-15.00%** Sudden Income Reduction | Simulates temporary income disruption (loss of overtime, reduced freelance contracts, unexpected medical expenditure). | **My Judgement** (Retail Risk Engineering) |

---

## 5. Safe Borrower vs. Lender Likely Amount Rule

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Lender Likely Amount** | $\text{Principal calculated at Max Lender FOIR (50\%)}$ | The maximum capital a lender is legally/financially willing to disburse to maximize interest revenue. | Bank Risk Model Standard |
| **Safe Borrower Amount** | $\text{Principal calculated at Safe FOIR (35\%) with 10\% Emergency Buffer}$ | The prudent loan size a borrower *should* take to avoid debt distress and preserve wealth creation capability. | **FPSB India** & Behavioral Financial Engineering (**My Judgement**) |

---

## 6. Confidence Scoring & Honest Range Widening

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **High Confidence (85% - 100%)** | Full inputs provided (Exact CIBIL, verified income, complete debt list). Range Spread: **±3%** | Precise inputs yield tight estimation bounds without artificial guesswork. | **My Judgement** |
| **Medium Confidence (60% - 84%)** | Estimated credit score or generalized living expenses. Range Spread: **±8%** | Partial estimation requires wider bounds to communicate honest uncertainty. | **My Judgement** |
| **Low Confidence (<60%)** | Missing credit score (`undefined`) or unknown existing debt obligations. Range Spread: **±15% to ±25%** | Prevents "fake precision" when vital financial indicators are absent. | **My Judgement** (NFR-04 Honest Uncertainty) |

---

## 7. Decision Synthesis Matrix

| Underwriting Decision | Criteria | Actionable Guidance |
| :--- | :--- | :--- |
| **Borrow** (`Approved`) | • FOIR $\le 40\%$<br>• CIBIL $\ge 725$<br>• Rate Shock Stress Test Passed | Proceed with loan request; leverage prime credit score to negotiate lower rate / fee waiver. |
| **Borrow Less** (`Caution`) | • FOIR $41\% - 50\%$<br>• Stress Test Failed OR CIBIL $650 - 724$ | Reduce principal to **Safe Borrower Amount** or extend tenure to bring FOIR $< 40\%$. |
| **Don't Borrow** (`High Risk`) | • FOIR $> 50\%$<br>• CIBIL $< 650$<br>• Monthly Net Income $< ₹15,000$ | High risk of debt trap. Pay down existing high-cost obligations before taking new debt. |
