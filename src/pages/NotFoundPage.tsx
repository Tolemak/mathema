import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topic from '../components/Topic';
import { useI18n } from '../i18n/useI18n';

const NotFoundPage: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="page-container">
      <Topic>{t('notFound.topic')}</Topic>
      <p>{t('notFound.text')}</p>
      <Link to="/" className="button">{t('notFound.home')}</Link>
    </div>
  );
};

export default NotFoundPage;
