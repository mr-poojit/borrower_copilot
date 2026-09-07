import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number | boolean }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      {label && <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>{label}</label>}
      <select
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          border: '1px solid #334155',
          backgroundColor: '#111917',
          color: '#f4f1e8',
          fontSize: '1rem',
          outline: 'none',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
