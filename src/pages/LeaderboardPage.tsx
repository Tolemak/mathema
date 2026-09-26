import React, { useState, useEffect } from 'react';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { fetchLeaderboard } from '../utils/leaderboardApi';
import Topic from '../components/Topic';

const LeaderboardPage: React.FC = () => {
    const [allScores, setAllScores] = useState<LeaderboardEntry[]>([]);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        fetchLeaderboard(undefined, 100)
            .then(setAllScores)
            .catch(() => setLoadError(true));
    }, []);

    return (
        <div className="page-container">
            <Topic>tablica wyników</Topic>
            {loadError ? (
                <p className="error-text">Nie udało się wczytać tablicy wyników. Spróbuj ponownie później.</p>
            ) : (
                <LeaderboardTable entries={allScores} title="Top 100 Graczy" />
            )}
        </div>
    );
};

export default LeaderboardPage;
