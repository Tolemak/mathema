import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { radialViewTransition } from '../utils/viewTransition';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    radialViewTransition(e.clientX, e.clientY, toggleTheme);
  };

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={handleClick}
      aria-label={theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
      title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
