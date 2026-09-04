import React, { useState } from 'react';
import { mustQuestions } from '../questions/mustQuestions';
import { additionalQuestions } from '../questions/additionalQuestions';
import { Question } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ProgressBar } from '../components/ui/ProgressBar';

interface AssessmentProps {
  onComplete: (answers: Record<string, any>) => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({
    incomeType: 'salaried',
    creditScoreBand: '750+',
    existingEMI: 0,
    householdExpenses: 0,
    requestedAmount: 500000,
    monthlyIncome: 75000,
    age: 28,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine and filter active questions dynamically
  const allQuestions = [...mustQuestions, ...additionalQuestions];
  const activeQuestions = allQuestions.filter(
    (q) => !q.showWhen || q.showWhen(answers)
  );

  const currentQuestion: Question | undefined = activeQuestions[currentIndex] || activeQuestions[0];

  const handleFieldValueChange = (field: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentQuestion) return null;

  const currentVal = answers[currentQuestion.field] ?? '';

  return (
    <div style={{ maxWidth: '640px', margin: '2.5rem auto', padding: '0 1rem' }}>
      {/* Step counter & progress bar */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600, color: '#818cf8' }}>
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          <span>{Math.round(((currentIndex + 1) / activeQuestions.length) * 100)}% Complete</span>
        </div>
        <ProgressBar progress={((currentIndex + 1) / activeQuestions.length) * 100} />
      </div>

      {/* Question Card */}
      <div
        style={{
          backgroundColor: '#131b2e',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
          {currentQuestion.title}
        </h2>
        
        {currentQuestion.description && (
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
            {currentQuestion.description}
          </p>
        )}

        {/* Question Inputs */}
        <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
          {currentQuestion.type === 'select' && currentQuestion.options ? (
            <Select
              options={currentQuestion.options}
              value={String(currentVal)}
              onChange={(e) => handleFieldValueChange(currentQuestion.field, e.target.value)}
            />
          ) : currentQuestion.type === 'boolean' ? (
            <Select
              options={[
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ]}
              value={String(currentVal)}
              onChange={(e) => handleFieldValueChange(currentQuestion.field, e.target.value === 'true')}
            />
          ) : currentQuestion.type === 'currency' ? (
            <Input
              type="number"
              prefixSymbol="₹"
              placeholder="e.g. 50000"
              value={currentVal}
              onChange={(e) => handleFieldValueChange(currentQuestion.field, Number(e.target.value))}
            />
          ) : (
            <Input
              type={currentQuestion.type === 'number' ? 'number' : 'text'}
              value={currentVal}
              onChange={(e) =>
                handleFieldValueChange(
                  currentQuestion.field,
                  currentQuestion.type === 'number' ? Number(e.target.value) : e.target.value
                )
              }
            />
          )}
        </div>

        {/* Why this question banner */}
        {currentQuestion.why && (
          <div
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderLeft: '3px solid #6366f1',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.825rem',
              color: '#a5b4fc',
              lineHeight: 1.4,
            }}
          >
            <strong>Why we ask:</strong> {currentQuestion.why}
          </div>
        )}

        {/* Navigation Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #1e293b' }}>
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
          >
            ← Back
          </Button>

          <Button variant="primary" onClick={handleNext}>
            {currentIndex === activeQuestions.length - 1 ? 'Calculate Assessment →' : 'Continue →'}
          </Button>
        </div>
      </div>
    </div>
  );
};
