import React from 'react';

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

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, title = "Tablica Wyników" }) => {
  if (!entries || entries.length === 0) {
    return <p style={{ textAlign: 'center', margin: '20px 0' }}>Brak wyników do wyświetlenia.</p>;
  }

  const sortedEntries = [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="leaderboard-container">
      <h3 className="leaderboard-title">{title}</h3>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Gracz</th>
            <th>Wynik</th>
            <th>Kategoria</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, index) => (
            <tr key={entry.id} className={entry.mine ? 'highlighted-player' : undefined}>
              <td>{index + 1}</td>
              <td>{entry.playerName}</td>
              <td>{Math.round(entry.score)}</td>
              <td>{entry.categoryName}</td>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
