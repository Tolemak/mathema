import React, { useState, useEffect } from 'react';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { fetchLeaderboard } from '../utils/leaderboardApi';
import Topic from '../components/Topic';
import { ApiError } from '../utils/leaderboardApi';
import { useI18n } from '../i18n/useI18n';

const LeaderboardPage: React.FC = () => {
    const { t } = useI18n();
    const [allScores, setAllScores] = useState<LeaderboardEntry[]>([]);
    const [loadError, setLoadError] = useState<'load' | 'rateLimited' | null>(null);

    useEffect(() => {
        fetchLeaderboard(undefined, 100)
            .then(setAllScores)
            .catch((error: unknown) => setLoadError(error instanceof ApiError && error.status === 429 ? 'rateLimited' : 'load'));
    }, []);

    return (
        <div className="page-container">
            <Topic>{t('leaderboard.topic')}</Topic>
            {loadError ? (
                <p className="error-text">{loadError === 'rateLimited' ? t('error.rateLimited') : t('error.load')}</p>
            ) : (
                <LeaderboardTable entries={allScores} title={t('leaderboard.top100')} />
            )}
        </div>
    );
};

export default LeaderboardPage;
