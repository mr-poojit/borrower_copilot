import { Question } from "../types";

export const additionalQuestions: Question[] = [
    // ─────────────
    // SALARIED
    // ─────────────

    {
        id: "employment-years",
        type: "number",
        title: "How long have you been with your current employer?",
        required: true,
        field: "employmentYears",
        showWhen: (answers) =>
            answers.incomeType === "salaried",
        why: "Longer employment history can provide evidence of income stability.",
    },

    {
        id: "income-stability-salaried",
        type: "boolean",
        title: "Has your income been broadly stable over the past year?",
        required: true,
        field: "incomeStable",
        showWhen: (answers) =>
            answers.incomeType === "salaried",
        why: "Stable income makes future repayment capacity easier to estimate.",
    },

    // ─────────────
    // SELF-EMPLOYED
    // ─────────────

    {
        id: "business-years",
        type: "number",
        title: "How long have you been running your business?",
        required: true,
        field: "businessYears",
        showWhen: (answers) =>
            answers.incomeType === "self-employed",
        why: "Business history provides context for the reliability of reported income.",
    },

    {
        id: "documented-income",
        type: "currency",
        title: "What is your documented annual income?",
        description: "Use your latest ITR or other formal income documentation.",
        required: true,
        field: "documentedAnnualIncome",
        showWhen: (answers) =>
            answers.incomeType === "self-employed",
        why: "Documented income may differ from cash flow and can affect lender eligibility.",
    },

    {
        id: "property-value",
        type: "currency",
        title: "Do you have property that could potentially secure the loan?",
        description: "Enter its approximate current value, or 0 if none.",
        required: true,
        field: "propertyValue",
        showWhen: (answers) =>
            answers.incomeType === "self-employed" ||
            answers.loanType === "lap" ||
            answers.loanType === "business",
        why: "Collateral can make a secured loan a potential alternative when an unsecured loan is less suitable.",
    },

    // ─────────────
    // INFORMAL / GIG
    // ─────────────

    {
        id: "variable-income-share",
        type: "select",
        title: "How much of your monthly income varies from month to month?",
        required: true,
        field: "variableIncomeShare",
        showWhen: (answers) =>
            answers.incomeType === "informal",
        options: [
            { label: "Almost none", value: 0 },
            { label: "Less than 25%", value: 0.25 },
            { label: "25–50%", value: 0.5 },
            { label: "More than 50%", value: 0.75 },
            { label: "Almost all of it", value: 1 },
        ],
        why: "Higher income variability makes future repayment capacity less predictable.",
    },

    {
        id: "missed-payments",
        type: "number",
        title: "How many loan payments have you missed or bounced in the last 12 months?",
        description: "Enter 0 if none.",
        required: true,
        field: "missedPayments",
        showWhen: (answers) =>
            answers.incomeType === "informal" ||
            Number(answers.existingEMI) > 0,
        why: "Recent missed payments are a warning sign that the current debt load may already be difficult to manage.",
    },

    // ─────────────
    // EXISTING DEBT
    // ─────────────

    {
        id: "existing-loans",
        type: "number",
        title: "How many active loans do you currently have?",
        required: true,
        field: "existingLoans",
        showWhen: (answers) =>
            Number(answers.existingEMI) > 0,
        why: "Multiple active loans can increase repayment complexity and financial pressure.",
    },

    // ─────────────
    // PRODUCTIVE LOAN
    // ─────────────

    {
        id: "productive-income",
        type: "currency",
        title: "How much additional monthly income do you realistically expect this loan to generate?",
        description: "Enter 0 if it won't directly generate income.",
        required: true,
        field: "expectedAdditionalIncome",
        showWhen: (answers) =>
            answers.loanPurpose === "business" ||
            answers.loanPurpose === "vehicle",
        why: "A productive loan may increase repayment capacity if the expected additional income is realistic.",
    },
];
