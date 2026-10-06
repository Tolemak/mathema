import React from 'react';
import { useI18n } from '../i18n/useI18n';

export interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  categoryId: string;
  categoryName: string;
  date: string;
  mine: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, title }) => {
  const { t, categoryName, playerName, formatDate, formatNumber } = useI18n();

  if (!entries || entries.length === 0) {
    return <p className="empty-text">{t('leaderboard.empty')}</p>;
  }

  const sortedEntries = [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="leaderboard-container">
      <h3 className="leaderboard-title">{title ?? t('leaderboard.title')}</h3>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('leaderboard.player')}</th>
            <th>{t('leaderboard.score')}</th>
            <th>{t('leaderboard.category')}</th>
            <th>{t('leaderboard.date')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, index) => (
            <tr key={entry.id} className={entry.mine ? 'highlighted-player' : undefined}>
              <td>{index + 1}</td>
              <td>{playerName(entry.playerName)}</td>
              <td>{formatNumber(Math.round(entry.score))}</td>
              <td>{categoryName(entry.categoryId, entry.categoryName)}</td>
              <td>{formatDate(entry.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
