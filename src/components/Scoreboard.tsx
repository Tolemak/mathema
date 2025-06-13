import React from 'react';

interface ScoreboardProps {
  score: number;
  questionsAnswered?: number; // Changed to optional
  totalQuestions: number;
  timeLeft?: number; 
  lastGameScore?: number; 
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, questionsAnswered, totalQuestions, timeLeft, lastGameScore }) => {
  return (
    <div className="scoreboard">
      <p>Wynik: {score}</p>
      {typeof questionsAnswered === 'number' && <p>Odpowiedzi: {questionsAnswered} / {totalQuestions}</p>}
      {typeof timeLeft === 'number' && <p>Czas na pytanie: {timeLeft.toFixed(1)}s</p>}
      {typeof lastGameScore === 'number' && <p>Ostatni wynik w tej kategorii: {lastGameScore}</p>}
    </div>
  );
};

export default Scoreboard;