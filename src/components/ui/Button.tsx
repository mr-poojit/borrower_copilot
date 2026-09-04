import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  style,
  ...props
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.4rem 0.8rem', fontSize: '0.85rem' },
    md: { padding: '0.65rem 1.3rem', fontSize: '0.95rem' },
    lg: { padding: '0.85rem 1.8rem', fontSize: '1.05rem' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#6366f1', color: '#ffffff', border: 'none', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' },
    secondary: { backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' },
    outline: { backgroundColor: 'transparent', border: '1px solid #6366f1', color: '#818cf8' },
    danger: { backgroundColor: '#ef4444', color: '#ffffff', border: 'none' },
  };

  return (
    <button
      style={{
        borderRadius: '0.5rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
