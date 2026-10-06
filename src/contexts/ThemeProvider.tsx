import React, { useEffect, useState, type ReactNode } from 'react';
import { radialViewTransition } from '../utils/viewTransition';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const onTheme = (event: Event) => {
      event.preventDefault();
      const next = (event as CustomEvent<{ theme: Theme }>).detail.theme;
      const bar = (event.target as HTMLElement).getBoundingClientRect();
      radialViewTransition(bar.right - 30, bar.top + bar.height / 2, () => setTheme(next));
    };
    document.addEventListener('tolemak-theme', onTheme);
    return () => document.removeEventListener('tolemak-theme', onTheme);
  }, []);

  return <>{children}</>;
};
