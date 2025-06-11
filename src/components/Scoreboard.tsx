import React from 'react';

interface ScoreboardProps {
  score: number;
  totalQuestions: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, totalQuestions }) => {
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <p>
        Score: {score} / {totalQuestions}
      </p>
    </div>
  );
};

export default Scoreboard;