import React from 'react';

interface ScoreboardProps {
  score: number;
  questionsAnswered?: number;
  totalQuestions: number;
  timeLeft?: number;
  bestScore?: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, questionsAnswered, totalQuestions, timeLeft, bestScore }) => {
  return (
    <div className="scoreboard">
      <p>Wynik: {score}</p>
      {typeof questionsAnswered === 'number' && <p>Odpowiedzi: {questionsAnswered} / {totalQuestions}</p>}
      {typeof timeLeft === 'number' && <p>Czas na pytanie: {timeLeft.toFixed(1)}s</p>}
      {typeof bestScore === 'number' && <p>Twój najlepszy wynik w tej kategorii: {bestScore}</p>}
    </div>
  );
};

export default Scoreboard;
