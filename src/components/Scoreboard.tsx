import React from 'react';
import { useI18n } from '../i18n/useI18n';

interface ScoreboardProps {
  score: number;
  questionsAnswered?: number;
  totalQuestions: number;
  timeLeft?: number;
  bestScore?: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, questionsAnswered, totalQuestions, timeLeft, bestScore }) => {
  const { t, formatNumber } = useI18n();
  return (
    <div className="scoreboard">
      <p>{t('score.score', { n: score })}</p>
      {typeof questionsAnswered === 'number' && <p>{t('score.answered', { n: questionsAnswered, total: totalQuestions })}</p>}
      {typeof timeLeft === 'number' && <p>{t('score.time', { n: formatNumber(timeLeft, 1) })}</p>}
      {typeof bestScore === 'number' && <p>{t('score.best', { n: bestScore })}</p>}
    </div>
  );
};

export default Scoreboard;
