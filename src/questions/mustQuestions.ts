import { Question } from "../types";

export const mustQuestions: Question[] = [
    {
        id: "loan-purpose",
        type: "select",
        title: "What do you need the loan for?",
        description: "Your purpose affects which loan product may make sense.",
        required: true,
        field: "loanPurpose",
        options: [
            { label: "Personal / Wedding", value: "personal" },
            { label: "Home purchase", value: "home" },
            { label: "Business", value: "business" },
            { label: "Vehicle", value: "vehicle" },
            { label: "Education", value: "education" },
            { label: "Medical / Emergency", value: "medical" },
            { label: "Debt repayment", value: "debt-repayment" },
            { label: "Other", value: "other" },
        ],
        why: "Loan purpose helps determine whether an unsecured or secured product may be appropriate.",
    },

    {
        id: "loan-amount",
        type: "currency",
        title: "How much do you want to borrow?",
        description: "Enter the amount you are considering.",
        required: true,
        field: "requestedAmount",
        why: "The amount requested is compared against both likely lender eligibility and your safe repayment capacity.",
    },

    {
        id: "loan-type",
        type: "select",
        title: "What type of loan are you considering?",
        required: true,
        field: "loanType",
        options: [
            { label: "Personal loan", value: "personal" },
            { label: "Home loan", value: "home" },
            { label: "Loan against property", value: "lap" },
            { label: "Gold loan", value: "gold" },
            { label: "Two-wheeler loan", value: "two-wheeler" },
            { label: "Business loan", value: "business" },
            { label: "Not sure", value: "unknown" },
        ],
        why: "Different loan products have different eligibility, pricing and security requirements.",
    },

    {
        id: "income-type",
        type: "select",
        title: "How do you earn your income?",
        required: true,
        field: "incomeType",
        options: [
            { label: "Salaried employee", value: "salaried" },
            { label: "Self-employed / business owner", value: "self-employed" },
            { label: "Gig / informal / variable income", value: "informal" },
        ],
        why: "Income stability and documentation can affect how a lender evaluates repayment capacity.",
    },

    {
        id: "monthly-income",
        type: "currency",
        title: "What is your monthly take-home income?",
        description: "Use your usual monthly amount after deductions.",
        required: true,
        field: "monthlyIncome",
        why: "Take-home income is the starting point for estimating an affordable monthly repayment.",
    },

    {
        id: "existing-emi",
        type: "currency",
        title: "How much do you currently pay toward loans each month?",
        description: "Include all existing EMIs.",
        required: true,
        field: "existingEMI",
        why: "Existing EMIs reduce the income available for a new loan.",
    },

    {
        id: "household-expenses",
        type: "currency",
        title: "How much does your household spend each month?",
        description: "Include rent, food, utilities, school fees and other regular expenses.",
        required: true,
        field: "householdExpenses",
        why: "A loan may technically be affordable on income alone but still leave too little cash after normal living costs.",
    },

    {
        id: "age",
        type: "number",
        title: "How old are you?",
        required: true,
        field: "age",
        why: "Age can affect available tenure and therefore the monthly repayment.",
    },

    {
        id: "credit-score",
        type: "select",
        title: "Do you know your credit score?",
        description: "If you don't know it, that's okay.",
        required: true,
        field: "creditScoreBand",
        options: [
            { label: "750 or above", value: "750+" },
            { label: "700–749", value: "700-749" },
            { label: "650–699", value: "650-699" },
            { label: "Below 650", value: "below-650" },
            { label: "I don't know", value: "unknown" },
        ],
        why: "Credit history can influence lender eligibility and pricing, but an unknown score is not treated as zero.",
    },

    {
        id: "emergency-savings",
        type: "select",
        title: "How many months of expenses could your savings cover?",
        required: true,
        field: "emergencySavingsMonths",
        options: [
            { label: "Less than 1 month", value: 0.5 },
            { label: "1–3 months", value: 2 },
            { label: "3–6 months", value: 4.5 },
            { label: "6+ months", value: 6 },
            { label: "I don't know", value: -1 },
        ],
        why: "A cash buffer can help absorb an income shock or unexpected expense while repaying a loan.",
    },
];
