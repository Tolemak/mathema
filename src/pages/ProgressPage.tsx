import React from 'react';
import { Link } from 'react-router-dom';
import Topic from '../components/Topic';
import { useI18n } from '../i18n/useI18n';

const ProgressPage: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="page-container">
            <Topic>{t('progress.topic')}</Topic>
            <p className="lead">
                {t('progress.lead')}
            </p>
            <Link to="/leaderboard" className="button">{t('progress.open')}</Link>
        </div>
    );
};

export default ProgressPage;
