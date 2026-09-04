import React from 'react';
import { Button } from '../components/ui/Button';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '800px',
        margin: '2rem auto',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        <span>🇮🇳</span> RBI-Compliant All-In APR & FOIR Engine
      </div>

      <h1
        style={{
          fontSize: '3.25rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.25rem',
        }}
      >
        Know your loan before you negotiate it.
      </h1>

      <p
        style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          maxWidth: '620px',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
        }}
      >
        Evaluate safe borrowing limits, compare lender limits against safe carry capacity, calculate true all-in APR, stress test your cash flows, and generate a lender negotiation card.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button size="lg" variant="primary" onClick={onStart}>
          Start Assessment →
        </Button>
      </div>

      {/* Feature Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '4rem',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: '#131b2e',
            border: '1px solid #1e293b',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            textAlign: 'left',
          }}
        >
          <div style={{ color: '#6366f1', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>No Login</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>100% private & instant local calculations without sign-up.</div>
        </div>

        <div
          style={{
            backgroundColor: '#131b2e',
            border: '1px solid #1e293b',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            textAlign: 'left',
          }}
        >
          <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>FOIR & Stress</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Evaluates safe income obligations & +2% rate shock resilience.</div>
        </div>

        <div
          style={{
            backgroundColor: '#131b2e',
            border: '1px solid #1e293b',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            textAlign: 'left',
          }}
        >
          <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>Negotiation Card</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Get exact counter-offer scripts & leverage points for bank visits.</div>
        </div>
      </div>
    </div>
  );
};
