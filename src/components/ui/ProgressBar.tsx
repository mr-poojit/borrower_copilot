import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#24302b',
        borderRadius: '9999px',
        overflow: 'hidden',
        border: '1px solid #334155',
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #d89216, #8bd3b2)',
          borderRadius: '9999px',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
};
