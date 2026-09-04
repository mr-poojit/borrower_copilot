import React, { useState } from 'react';
import { AssessmentResult } from '../types';
import { Button } from '../components/ui/Button';

interface NegotiationProps {
  result: AssessmentResult;
  onBack: () => void;
}

export const Negotiation: React.FC<NegotiationProps> = ({ result, onBack }) => {
  const [selectedScript, setSelectedScript] = useState<'rate' | 'fee' | 'amount'>('rate');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div style={{ maxWidth: '750px', margin: '2.5rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.75rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Lender Negotiation Copilot
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
          Your Bank Counter-Offer Strategy
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '0.5rem', lineHeight: 1.5 }}>
          Use these target financial levers and scripts when speaking with bank representatives or loan agents.
        </p>
      </div>

      {/* Target Levers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div
          onClick={() => setSelectedScript('rate')}
          style={{
            backgroundColor: selectedScript === 'rate' ? '#1e1b4b' : '#131b2e',
            border: selectedScript === 'rate' ? '2px solid #6366f1' : '1px solid #1e293b',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700 }}>TARGET FAIR RATE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
            {result.rate.fairMin.toFixed(2)}% – {result.rate.fairMax.toFixed(2)}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Counter rate markup</div>
        </div>

        <div
          onClick={() => setSelectedScript('fee')}
          style={{
            backgroundColor: selectedScript === 'fee' ? '#1e1b4b' : '#131b2e',
            border: selectedScript === 'fee' ? '2px solid #6366f1' : '1px solid #1e293b',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>PROCESSING FEE WAIVER</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
            0% – 0.50%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Save up to {formatINR(result.rate.processingFeeAmount)}</div>
        </div>

        <div
          onClick={() => setSelectedScript('amount')}
          style={{
            backgroundColor: selectedScript === 'amount' ? '#1e1b4b' : '#131b2e',
            border: selectedScript === 'amount' ? '2px solid #6366f1' : '1px solid #1e293b',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>SAFE BORROW AMOUNT</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
            {formatINR(result.amount.safeCarry)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Don't over-borrow</div>
        </div>
      </div>

      {/* Script Box */}
      <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.75rem' }}>
          💬 Recommended Negotiation Script
        </h3>

        <div
          style={{
            backgroundColor: '#090d16',
            border: '1px dashed #334155',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            fontSize: '0.95rem',
            color: '#f8fafc',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          {selectedScript === 'rate' && (
            `"Based on my FOIR analysis and credit band, competitive lenders offer rates in the ${result.rate.fairMin.toFixed(2)}% – ${result.rate.fairMax.toFixed(2)}% range. I am willing to proceed with your sanction if you match an interest rate of ${result.rate.fairMin.toFixed(2)}%."`
          )}
          {selectedScript === 'fee' && (
            `"I noticed a processing fee charge of ${result.rate.processingFee}% (${formatINR(result.rate.processingFeeAmount)} + 18% GST). Since my application has low documentation overhead, I request a full waiver of the processing fee prior to sign-off."`
          )}
          {selectedScript === 'amount' && (
            `"While your eligibility cap allows up to ${formatINR(result.amount.likelySanction)}, my strict safe repayment capacity is ${formatINR(result.amount.safeCarry)}. Please structure the loan principal at ${formatINR(result.amount.safeCarry)} to keep my EMI safe."`
          )}
        </div>
      </div>

      {/* Questions to Ask Lender */}
      <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          📋 What to Ask the Lender Before Signing (Checklist)
        </h3>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', color: '#cbd5e1', fontSize: '0.9rem' }}>
          <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
            <span>What is the <strong>all-in APR</strong> including processing fee, GST, stamp duty, and insurance?</span>
          </li>
          <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
            <span>Are there any <strong>foreclosure or part-prepayment charges</strong> after 12 months?</span>
          </li>
          <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
            <span>Is credit shield or loan insurance <strong>optional</strong> or mandatory for this approval?</span>
          </li>
        </ul>
      </div>

      <div>
        <Button variant="secondary" onClick={onBack}>
          ← Back to Results
        </Button>
      </div>
    </div>
  );
};
