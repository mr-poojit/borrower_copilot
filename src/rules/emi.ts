export interface EMIInput {
    principal: number;
    annualRate: number;
    tenureMonths: number;
}

export interface EMIResult {
    emi: number;
    totalPayment: number;
    totalInterest: number;
}

export function calculateEMI({
    principal,
    annualRate,
    tenureMonths,
}: EMIInput): EMIResult {
    if (principal <= 0 || tenureMonths <= 0) {
        return {
            emi: 0,
            totalPayment: 0,
            totalInterest: 0,
        };
    }

    const monthlyRate = annualRate / 100 / 12;

    if (monthlyRate === 0) {
        const emi = principal / tenureMonths;

        return {
            emi,
            totalPayment: principal,
            totalInterest: 0,
        };
    }

    const factor = Math.pow(
        1 + monthlyRate,
        tenureMonths
    );

    const emi =
        (principal * monthlyRate * factor) /
        (factor - 1);

    const totalPayment = emi * tenureMonths;

    return {
        emi,
        totalPayment,
        totalInterest: totalPayment - principal,
    };
}
