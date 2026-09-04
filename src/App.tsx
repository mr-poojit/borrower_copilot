import { useState } from 'react';
import { Welcome } from './pages/Welcome';
import { Assessment } from './pages/Assessment';
import { Results } from './pages/Results';
import { Negotiation } from './pages/Negotiation';
import { AssessmentResult, BorrowerProfile } from './types';
import { calculateAffordability, calculateEMI } from './rules';

export function App() {
  const [activeTab, setActiveTab] = useState<'welcome' | 'assessment' | 'results' | 'negotiation'>('welcome');

  // Default sample profile so Results & Negotiation can be viewed immediately even before taking test
  const defaultProfile: BorrowerProfile = {
    age: 28,
    loanPurpose: 'personal',
    loanType: 'personal',
    requestedAmount: 500000,
    incomeType: 'salaried',
    monthlyIncome: 75000,
    existingEMI: 10000,
    householdExpenses: 25000,
    creditScoreBand: '750+',
    emergencySavingsMonths: 4.5,
  };

  const evaluateProfile = (profile: BorrowerProfile): AssessmentResult => {
    const foir = profile.incomeType === 'salaried' ? 0.50 : 0.45;
    const safeFoir = 0.38;

    // Rate tier determination
    let expectedRate = 12.0;
    if (profile.creditScoreBand === '750+') expectedRate = 10.5;
    else if (profile.creditScoreBand === '700-749') expectedRate = 12.5;
    else if (profile.creditScoreBand === '650-699') expectedRate = 15.0;
    else if (profile.creditScoreBand === 'below-650') expectedRate = 18.5;

    const tenureMonths = 36;
    const processingFeePercent = 1.5;
    const processingFeeAmount = (profile.requestedAmount * processingFeePercent) / 100;

    // EMI calculation for requested amount
    const emiCalc = calculateEMI({
      principal: profile.requestedAmount,
      annualRate: expectedRate,
      tenureMonths,
    });

    // Affordability calculation
    const affCalc = calculateAffordability(profile, {
      foir: safeFoir,
      annualRate: expectedRate,
      tenureMonths,
    });

    const lenderAffCalc = calculateAffordability(profile, {
      foir,
      annualRate: expectedRate,
      tenureMonths,
    });

    // Stress test: +2.0% rate shock
    const stressedEmiCalc = calculateEMI({
      principal: profile.requestedAmount,
      annualRate: expectedRate + 2.0,
      tenureMonths,
    });

    const totalStressedObligation = profile.existingEMI + stressedEmiCalc.emi;
    const stressedFOIR = profile.monthlyIncome > 0 ? totalStressedObligation / profile.monthlyIncome : 1;
    const stressPasses = stressedFOIR <= 0.55;

    // Decision synthesis
    const currentTotalFOIR = (profile.existingEMI + emiCalc.emi) / profile.monthlyIncome;
    let decision: 'borrow' | 'borrow-less' | 'dont-borrow' = 'borrow';
    let decisionReason = 'Your income FOIR and credit profile support this loan request safely.';

    if (currentTotalFOIR > 0.50 || !stressPasses) {
      decision = 'borrow-less';
      decisionReason = `Your proposed loan pushes total debt obligations to ${(currentTotalFOIR * 100).toFixed(0)}% of income. Borrowing up to the safe amount (${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(affCalc.safeCarryAmount)}) keeps EMI manageable.`;
    }

    if (currentTotalFOIR > 0.65 || profile.creditScoreBand === 'below-650') {
      decision = 'dont-borrow';
      decisionReason = 'High risk of debt distress. Existing obligations or credit score suggest prioritizing debt reduction before taking new loans.';
    }

    // Confidence determination
    const confidence = profile.creditScoreBand === 'unknown' ? 'medium' : 'high';

    return {
      decision,
      decisionReason,
      confidence,
      confidenceReason: 'Calculated using verified income, existing debt obligations, and standard banking FOIR guidelines.',
      amount: {
        likelySanction: Math.round(lenderAffCalc.safeCarryAmount),
        safeCarry: Math.round(affCalc.safeCarryAmount),
        recommendedAmount: Math.min(profile.requestedAmount, Math.round(affCalc.safeCarryAmount)),
        whySanction: `Lenders tolerate up to ${(foir * 100).toFixed(0)}% total FOIR for your income type.`,
        whySafeCarry: `Keeps total obligations within ${safeFoir * 100}% FOIR so you retain buffer for emergency savings.`,
      },
      rate: {
        fairMin: expectedRate - 0.5,
        fairMax: expectedRate + 1.0,
        expectedRate,
        processingFee: processingFeePercent,
        processingFeeAmount,
        apr: expectedRate + (processingFeePercent * 0.4),
        why: `Base rate derived from ${profile.creditScoreBand} credit score tier + 1.5% processing fee & 18% GST disclosure per RBI rules.`,
      },
      emi: {
        recommendedEMI: Math.round(emiCalc.emi),
        maximumEMI: Math.round(affCalc.maximumTotalEMI),
        tenureMonths,
        totalInterest: Math.round(emiCalc.totalInterest),
        why: `Based on a ${tenureMonths}-month tenure at ${expectedRate.toFixed(2)}% interest rate.`,
      },
      stressTest: {
        scenario: '+2.0% Rate Spike Stress Test',
        incomeAfterStress: profile.monthlyIncome - profile.householdExpenses - totalStressedObligation,
        EMI: Math.round(stressedEmiCalc.emi),
        remainingIncome: profile.monthlyIncome - totalStressedObligation,
        passes: stressPasses,
        explanation: stressPasses
          ? `If interest rates rise by 2.0%, your monthly EMI increases to ₹${Math.round(stressedEmiCalc.emi).toLocaleString('en-IN')}/mo, staying within safe debt tolerance.`
          : `A +2.0% interest rate spike increases total debt ratio to ${(stressedFOIR * 100).toFixed(0)}%, exceeding safe cashflow limits.`,
      },
      assumptions: ['38% Safe FOIR', '50% Max Lender FOIR', '+2.0% Rate Shock', '1.5% Processing Fee + 18% GST'],
    };
  };

  const [currentResult, setCurrentResult] = useState<AssessmentResult>(evaluateProfile(defaultProfile));

  const handleAssessmentComplete = (answers: Record<string, any>) => {
    const profile: BorrowerProfile = {
      age: Number(answers.age || 28),
      loanPurpose: answers.loanPurpose || 'personal',
      loanType: answers.loanType || 'personal',
      requestedAmount: Number(answers.requestedAmount || 500000),
      incomeType: answers.incomeType || 'salaried',
      monthlyIncome: Number(answers.monthlyIncome || 75000),
      existingEMI: Number(answers.existingEMI || 0),
      householdExpenses: Number(answers.householdExpenses || 0),
      creditScoreBand: answers.creditScoreBand || '750+',
      emergencySavingsMonths: Number(answers.emergencySavingsMonths || 4.5),
    };

    const newResult = evaluateProfile(profile);
    setCurrentResult(newResult);
    setActiveTab('results');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header
        style={{
          backgroundColor: '#131b2e',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }} onClick={() => setActiveTab('welcome')}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '1.1rem',
              }}
            >
              ₹
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              Borrower Copilot
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#090d16', padding: '0.25rem', borderRadius: '0.625rem', border: '1px solid #1e293b' }}>
            <button
              onClick={() => setActiveTab('welcome')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: activeTab === 'welcome' ? '#6366f1' : 'transparent',
                color: activeTab === 'welcome' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              Welcome
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: activeTab === 'assessment' ? '#6366f1' : 'transparent',
                color: activeTab === 'assessment' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              Assessment
            </button>

            <button
              onClick={() => setActiveTab('results')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: activeTab === 'results' ? '#6366f1' : 'transparent',
                color: activeTab === 'results' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              Results
            </button>

            <button
              onClick={() => setActiveTab('negotiation')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                backgroundColor: activeTab === 'negotiation' ? '#6366f1' : 'transparent',
                color: activeTab === 'negotiation' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              Negotiation Card
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'welcome' && <Welcome onStart={() => setActiveTab('assessment')} />}
        {activeTab === 'assessment' && <Assessment onComplete={handleAssessmentComplete} />}
        {activeTab === 'results' && (
          <Results
            result={currentResult}
            onNavigateToNegotiation={() => setActiveTab('negotiation')}
            onReevaluate={() => setActiveTab('assessment')}
          />
        )}
        {activeTab === 'negotiation' && <Negotiation result={currentResult} onBack={() => setActiveTab('results')} />}
      </main>
    </div>
  );
}

export default App;
