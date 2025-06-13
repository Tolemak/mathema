import React from 'react';

export interface LeaderboardEntry {
  id: string; 
  playerName: string;
  score: number;
  categoryName: string;
  date: string; 
  difficulty?: string; 
  schoolLevel?: string; 
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title?: string;
  highlightEntryId?: string; 
  highlightPlayerName?: string; // New prop
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, title = "Tablica Wyników", highlightEntryId, highlightPlayerName }) => {
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
    <div className="leaderboard-container" style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{title}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>#</th>
            <th style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>Gracz</th>
            <th style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>Wynik</th>
            <th style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>Kategoria</th>
            <th style={{ borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>Data</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, index) => {
            const isHighlighted = highlightEntryId ? entry.id === highlightEntryId : (highlightPlayerName ? entry.playerName === highlightPlayerName : false);
            return (
              <tr key={entry.id} style={isHighlighted ? { backgroundColor: '#e6ffed' } : {}}>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{index + 1}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{entry.playerName}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{Math.round(entry.score)}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{entry.categoryName}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{new Date(entry.date).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
