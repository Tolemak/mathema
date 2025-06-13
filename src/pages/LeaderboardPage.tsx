import React, { useState, useEffect } from 'react';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link } from 'react-router-dom';
import { getCookie } from '../utils/cookies'; // Import from new location

const loadAllLeaderboardDataFromCookie = (): LeaderboardEntry[] => {
    const data = getCookie('leaderboard');
    let allEntries: LeaderboardEntry[] = [];
    if (data) {
        try {
            allEntries = JSON.parse(data);
        } catch (error) {
            console.error("Failed to parse leaderboard cookie data:", error);
            allEntries = [];
        }
    }
    return allEntries.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).slice(0, 100);
};

const LeaderboardPage: React.FC = () => {
    const [allScores, setAllScores] = useState<LeaderboardEntry[]>([]);
    const [guestPlayerName, setGuestPlayerName] = useState<string | null>(null);

    useEffect(() => {
        setAllScores(loadAllLeaderboardDataFromCookie());
        const currentGuestId = getCookie('guestId');
        if (currentGuestId && currentGuestId.startsWith('guest_')) {
            setGuestPlayerName(`Gość ${currentGuestId.substring(6,12)}`);
        }
    }, []);

    return (
        <div className="page-container">
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Globalna Tablica Wyników</h1>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Link to="/" className="nav-button-link secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16" style={{ marginRight: '8px'}}>
                         <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
                    Powrót do strony głównej
                </Link>
            </div>
            <LeaderboardTable entries={allScores} title="Top 100 Graczy" highlightPlayerName={guestPlayerName || undefined} />
        </div>
    );
};

export default LeaderboardPage;
