import React from 'react';
import { useI18n } from '../i18n/useI18n';

const Footer: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer className="main-footer">
      <p>
        &copy; {new Date().getFullYear()} Mathema,{' '}
        <a href="https://kamil-galkowski.pl" target="_blank" rel="noopener noreferrer">Kamil Gałkowski</a>.{' '}
        <a href="https://github.com/Tolemak/mathema" target="_blank" rel="noopener noreferrer">{t('footer.code')}</a>
      </p>
    </footer>
  );
};

export default Footer;
