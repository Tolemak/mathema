import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage'; // Updated import path
import PracticeAreaPage from './pages/PracticeAreaPage'; // Nowa strona do ćwiczeń
import InteractiveModePage from './pages/InteractiveModePage'; // New import
import BrowseModePage from './pages/BrowseModePage'; // New import
import './styles/global.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Strona główna to teraz WelcomePage */}
        <Route path="/" element={<WelcomePage />} /> 
        {/* Nowa ścieżka do obszaru ćwiczeń */}
        <Route path="/practice" element={<PracticeAreaPage />} />
        {/* Nowe trasy dla trybu interaktywnego i przeglądania */}
        <Route path="/practice/interactive/:categoryId" element={<InteractiveModePage />} /> {/* New route */}
        <Route path="/practice/browse/:categoryId" element={<BrowseModePage />} /> {/* New route */}
        {/* Możesz dodać więcej ścieżek tutaj, np. do logowania, profilu użytkownika etc. */}
      </Routes>
    </Router>
  );
};

export default App;