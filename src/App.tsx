import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import PracticeAreaPage from './pages/PracticeAreaPage';
import InteractiveModePage from './pages/InteractiveModePage';
import BrowseModePage from './pages/BrowseModePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProgressPage from './pages/ProgressPage';
import Footer from './components/Footer';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <main className="content-wrap">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/practice" element={<PracticeAreaPage />} />
            <Route path="/practice/interactive/:categoryId" element={<InteractiveModePage />} />
            <Route path="/practice/browse/:categoryId" element={<BrowseModePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="*" element={
              <div className="page-container" style={{textAlign: 'center', padding: '60px'}}>
                <h1 style={{fontSize: '3em', color: '#e67e22'}}>404</h1>
                <p>Nie znaleziono strony lub zasobu.</p>
                <a href="/" className="nav-button-link primary">Powrót na stronę główną</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;