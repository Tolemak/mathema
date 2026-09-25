import React, { useState, useEffect } from 'react';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link } from 'react-router-dom';
import { fetchLeaderboard } from '../utils/leaderboardApi';
import { FaArrowCircleLeft } from 'react-icons/fa';

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
            <h1>Globalna Tablica Wyników</h1>
            <div className="back-link-container">
                <Link to="/" className="nav-button-link secondary">
                    <FaArrowCircleLeft className="nav-button-icon" />
                    Powrót do strony głównej
                </Link>
            </div>
            {loadError ? (
                <p style={{ textAlign: 'center' }}>Nie udało się wczytać tablicy wyników. Spróbuj ponownie później.</p>
            ) : (
                <LeaderboardTable entries={allScores} title="Top 100 Graczy" />
            )}
        </div>
    );
};

export default LeaderboardPage;
