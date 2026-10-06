import React, { type ReactNode } from 'react';
import { useI18n } from '../i18n/useI18n';

// Page titles are written the way a lesson starts in a Polish school notebook.
const Topic: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useI18n();
  return (
    <h1 className="topic">
      <span className="topic-label">{t('topic.label')}</span> {children}
    </h1>
  );
};

export default Topic;
