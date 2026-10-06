import React from 'react';
import { Link } from 'react-router-dom';
import DailyTask from '../components/DailyTask';
import Topic from '../components/Topic';
import { useI18n } from '../i18n/useI18n';

const WelcomePage: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="page-container welcome">
      <Topic>{t('welcome.topic')}</Topic>
      <p className="lead">{t('welcome.lead')}</p>

      <DailyTask />

      <section className="next-steps" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title">{t('welcome.next')}</h2>
        <ul className="contents">
          <li>
            <Link to="/practice?mode=interactive">{t('welcome.interactive')}</Link>
            <span>{t('welcome.interactiveText')}</span>
          </li>
          <li>
            <Link to="/practice?mode=browse">{t('welcome.browse')}</Link>
            <span>{t('welcome.browseText')}</span>
          </li>
          <li>
            <Link to="/leaderboard">{t('welcome.leaderboard')}</Link>
            <span>{t('welcome.leaderboardText')}</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default WelcomePage;
