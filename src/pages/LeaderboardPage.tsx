import React, { useState, useEffect } from 'react';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link } from 'react-router-dom';
import { getCookie } from '../utils/cookies';
import { FaArrowCircleLeft } from 'react-icons/fa';

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
            <h1>Globalna Tablica Wyników</h1>
            <div className="back-link-container">
                <Link to="/" className="nav-button-link secondary">
                    <FaArrowCircleLeft className="nav-button-icon" />
                    Powrót do strony głównej
                </Link>
            </div>
            <LeaderboardTable entries={allScores} title="Top 100 Graczy" highlightPlayerName={guestPlayerName || undefined} />
        </div>
    );
};

export default LeaderboardPage;
