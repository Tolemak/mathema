import React from 'react';
import { BrowserRouter as Router, Link, NavLink, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import PracticeAreaPage from './pages/PracticeAreaPage';
import InteractiveModePage from './pages/InteractiveModePage';
import BrowseModePage from './pages/BrowseModePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProgressPage from './pages/ProgressPage';
import Footer from './components/Footer';
import StatusBar from './components/StatusBar';
import Topic from './components/Topic';
import { ThemeProvider } from './contexts/ThemeProvider';
import './styles/global.css';

const today = new Date();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <header className="notebook-head">
            <Link to="/" className="wordmark">mathema</Link>
            <nav className="notebook-nav" aria-label="Główne">
              <NavLink to="/practice">Ćwiczenia</NavLink>
              <NavLink to="/leaderboard">Tablica wyników</NavLink>
            </nav>
            <time className="notebook-date" dateTime={today.toISOString().slice(0, 10)}>
              {today.toLocaleDateString('pl-PL')}
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
              <Route path="*" element={
                <div className="page-container">
                  <Topic>Strona 404</Topic>
                  <p>Nie znaleziono strony lub zasobu.</p>
                  <Link to="/" className="button">Powrót na stronę główną</Link>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <StatusBar />
      </Router>
    </ThemeProvider>
  );
};

export default App;
