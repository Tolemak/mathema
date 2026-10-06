import React from 'react';

interface MarkedAnswerProps {
  given: string;
  correct: boolean;
  expected: string | number;
}

const MarkedAnswer: React.FC<MarkedAnswerProps> = ({ given, correct, expected }) => {
  if (correct) {
    return (
      <span className="marked">
        <span className="given circled">
          {given}
          <svg viewBox="0 0 60 44" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 24c2-14 22-20 36-15s14 20-2 26-34 4-38-6c-2-6 2-12 8-15" />
          </svg>
        </span>
        <svg className="tick" viewBox="0 0 30 26" role="img" aria-label="dobrze">
          <path d="M3 14l8 8L27 3" />
        </svg>
      </span>
    );
  }

  return (
    <span className="marked">
      <s className="given" aria-label={`źle: ${given}`}>{given}</s>
      <span className="correction">{expected}</span>
    </span>
  );
};

export default MarkedAnswer;
