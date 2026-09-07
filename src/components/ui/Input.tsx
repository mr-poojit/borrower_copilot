import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixSymbol?: string;
}

export const Input: React.FC<InputProps> = ({ label, prefixSymbol, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      {label && <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefixSymbol && (
          <span style={{ position: 'absolute', left: '1rem', color: '#94a3b8', fontWeight: 600 }}>
            {prefixSymbol}
          </span>
        )}
        <input
          style={{
            width: '100%',
            padding: prefixSymbol ? '0.75rem 1rem 0.75rem 2.25rem' : '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #3a4942',
            backgroundColor: '#111917',
            color: '#f4f1e8',
            fontSize: '1rem',
            outline: 'none',
            ...style,
          }}
          {...props}
        />
      </div>
    </div>
  );
};
