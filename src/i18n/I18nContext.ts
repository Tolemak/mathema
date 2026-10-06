import { createContext } from 'react';
import { LOCALES, lookup, translate, type Lang, type MessageKey, type MessageVars } from './dictionary';

export interface I18nValue {
  lang: Lang;
  locale: string;
  setLang: (lang: Lang) => void;
  t: (key: MessageKey, vars?: MessageVars) => string;
  categoryName: (id: string, fallback: string) => string;
  levelName: (level: string) => string;
  difficultyName: (difficulty: string) => string;
  playerName: (name: string) => string;
  formatDate: (value: string | Date) => string;
  formatNumber: (value: number, digits?: number) => string;
}

/** Builds the translation and formatting helpers for one language. */
export function createI18n(lang: Lang, setLang: (lang: Lang) => void): I18nValue {
  const locale = LOCALES[lang];
  return {
    lang,
    locale,
    setLang,
    t: (key, vars) => translate(lang, key, vars),
    categoryName: (id, fallback) => lookup(lang, 'category', id, fallback),
    levelName: (level) => lookup(lang, 'level', level, level),
    difficultyName: (difficulty) => lookup(lang, 'difficulty', difficulty, difficulty),
    playerName: (name) => {
      const match = /^Gość ([A-Z0-9]+)$/.exec(name);
      return match ? `${translate(lang, 'leaderboard.guest')} ${match[1]}` : name;
    },
    formatDate: (value) => new Intl.DateTimeFormat(locale).format(new Date(value)),
    formatNumber: (value, digits = 0) =>
      new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value),
  };
}

export const I18nContext = createContext<I18nValue>(createI18n('pl', () => undefined));
