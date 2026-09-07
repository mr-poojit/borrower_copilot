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
    primary: { backgroundColor: '#f4b942', color: '#19140a', border: 'none', boxShadow: '0 5px 16px rgba(244,185,66,0.22)' },
    secondary: { backgroundColor: '#24302b', color: '#f4f1e8', border: '1px solid #3a4942' },
    outline: { backgroundColor: 'transparent', border: '1px solid #f4b942', color: '#f4c968' },
    danger: { backgroundColor: '#d95c48', color: '#ffffff', border: 'none' },
  };

  return (
    <button
      style={{
        borderRadius: '0.4rem',
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
