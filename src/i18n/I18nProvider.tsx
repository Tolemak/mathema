import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isLang, type Lang } from './dictionary';
import { createI18n, I18nContext } from './I18nContext';

const LANG_KEY = 'lang';

function readStored(): Lang | null {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

function writeStored(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    return;
  }
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => readStored() ?? 'pl');

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeStored(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onLang = (event: Event) => {
      const next = (event as CustomEvent<{ lang: unknown }>).detail?.lang;
      if (isLang(next)) setLang(next);
    };
    document.addEventListener('tolemak-lang', onLang);
    return () => document.removeEventListener('tolemak-lang', onLang);
  }, [setLang]);

  const value = useMemo(() => createI18n(lang, setLang), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
