import React from 'react';
import { AssessmentResult } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface ResultsProps {
  result: AssessmentResult;
  onNavigateToNegotiation: () => void;
  onReevaluate: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onNavigateToNegotiation, onReevaluate }) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const decisionBadgeVariant =
    result.decision === 'borrow' ? 'success' : result.decision === 'borrow-less' ? 'warning' : 'danger';

  const confidenceBadgeVariant =
    result.confidence === 'high' ? 'success' : result.confidence === 'medium' ? 'warning' : 'danger';

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#131b2e',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
          padding: '1.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Underwriting Assessment
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
            Loan Evaluation Results
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Badge variant={decisionBadgeVariant}>{result.decision.toUpperCase()}</Badge>
          <Badge variant={confidenceBadgeVariant}>{result.confidence.toUpperCase()} CONFIDENCE</Badge>
        </div>
      </div>

      {/* Decision Card */}
      <div
        style={{
          backgroundColor: '#131b2e',
          borderLeft: `4px solid ${
            result.decision === 'borrow' ? '#10b981' : result.decision === 'borrow-less' ? '#f59e0b' : '#ef4444'
          }`,
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Recommendation Summary
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          {result.decisionReason}
        </p>
      </div>

      {/* Amounts Grid: Safe Carry vs Lender Sanction */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em' }}>
            SAFE BORROWER AMOUNT
          </span>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
            {formatINR(result.amount.safeCarry)}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.5 }}>
            <strong>Why:</strong> {result.amount.whySafeCarry}
          </p>
        </div>

        <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 700, letterSpacing: '0.05em' }}>
            MAX LIKELY LENDER SANCTION
          </span>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
            {formatINR(result.amount.likelySanction)}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.5 }}>
            <strong>Why:</strong> {result.amount.whySanction}
          </p>
        </div>
      </div>

      {/* Pricing & EMI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.05em' }}>
            FAIR RATE & ALL-IN APR
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
            {result.rate.expectedRate.toFixed(2)}% <span style={{ fontSize: '0.95rem', color: '#94a3b8' }}>({result.rate.apr.toFixed(2)}% APR)</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.5 }}>
            Includes {result.rate.processingFee}% processing fee ({formatINR(result.rate.processingFeeAmount)}) + 18% GST per RBI disclosures.
          </p>
        </div>

        <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '0.875rem', padding: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 700, letterSpacing: '0.05em' }}>
            RECOMMENDED MONTHLY EMI
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
            {formatINR(result.emi.recommendedEMI)} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ month</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.5 }}>
            <strong>Max EMI Ceiling:</strong> {formatINR(result.emi.maximumEMI)} ({result.emi.why})
          </p>
        </div>
      </div>

      {/* Stress Test */}
      <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '0.875rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
            Rate Shock Stress Test (+2.0% Spike)
          </h4>
          <Badge variant={result.stressTest.passes ? 'success' : 'danger'}>
            {result.stressTest.passes ? 'STRESS TEST PASSED' : 'STRESS TEST FAILED'}
          </Badge>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.75rem', lineHeight: 1.5 }}>
          {result.stressTest.explanation}
        </p>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={onReevaluate}>
          ← Re-evaluate Inputs
        </Button>
        <Button variant="primary" onClick={onNavigateToNegotiation}>
          Open Negotiation Card →
        </Button>
      </div>
    </div>
  );
};
