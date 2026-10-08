import React from 'react';
import { BrowserRouter as Router, Link, NavLink, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import PracticeAreaPage from './pages/PracticeAreaPage';
import InteractiveModePage from './pages/InteractiveModePage';
import BrowseModePage from './pages/BrowseModePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProgressPage from './pages/ProgressPage';
import NotFoundPage from './pages/NotFoundPage';
import CanonicalLink from './components/CanonicalLink';
import Footer from './components/Footer';
import StatusBar from './components/StatusBar';
import { ThemeProvider } from './contexts/ThemeProvider';
import { I18nProvider } from './i18n/I18nProvider';
import { useI18n } from './i18n/useI18n';
import './styles/global.css';

const today = new Date();

const Shell: React.FC = () => {
  const { t, formatDate } = useI18n();
  return (
    <>
      <Router>
        <CanonicalLink />
        <div className="app-container">
          <header className="notebook-head">
            <Link to="/" className="wordmark">mathema</Link>
            <nav className="notebook-nav" aria-label={t('nav.aria')}>
              <NavLink to="/practice">{t('nav.practice')}</NavLink>
              <NavLink to="/leaderboard">{t('nav.leaderboard')}</NavLink>
            </nav>
            <time className="notebook-date" dateTime={today.toISOString().slice(0, 10)}>
              {formatDate(today)}
            </time>
          </header>
          <main className="content-wrap">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/practice" element={<PracticeAreaPage />} />
              <Route path="/practice/interactive/:categoryId" element={<InteractiveModePage />} />
              <Route path="/practice/browse/:categoryId" element={<BrowseModePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <StatusBar />
      </Router>
    </>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <I18nProvider>
      <Shell />
    </I18nProvider>
  </ThemeProvider>
);

export default App;
