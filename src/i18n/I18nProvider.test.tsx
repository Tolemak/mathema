import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../tolemak-bar/tolemak-bar.js';
import StatusBar from '../components/StatusBar';
import LeaderboardTable from '../components/LeaderboardTable';
import { I18nProvider } from './I18nProvider';
import { useI18n } from './useI18n';

const Probe = () => {
    const { t, lang } = useI18n();
    return <p data-testid="probe">{lang}:{t('nav.practice')}</p>;
};

const renderApp = () =>
    render(
        <MemoryRouter>
            <I18nProvider>
                <Probe />
                <StatusBar />
                <LeaderboardTable
                    entries={[{ id: 1, playerName: 'Gość ABCDE', score: 1234, categoryId: 'algebra', categoryName: 'Algebra', date: '2026-03-04T12:00:00.000Z', mine: false }]}
                />
            </I18nProvider>
        </MemoryRouter>,
    );

const pressLanguageButton = () => {
    const bar = document.querySelector('tolemak-bar') as HTMLElement;
    const button = bar.shadowRoot?.querySelector('.lang') as HTMLButtonElement;
    act(() => button.click());
};

describe('language toggle', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.lang = 'pl';
    });
    afterEach(cleanup);

    it('starts in Polish and exposes the bar switcher', () => {
        renderApp();
        expect(screen.getByTestId('probe').textContent).toBe('pl:Ćwiczenia');
        expect(document.documentElement.lang).toBe('pl');
        expect(document.querySelector('tolemak-bar')?.getAttribute('langs')).toBe('pl,en');
    });

    it('switches to English, updates html lang and persists the choice', () => {
        renderApp();
        pressLanguageButton();

        expect(screen.getByTestId('probe').textContent).toBe('en:Practice');
        expect(document.documentElement.lang).toBe('en');
        expect(localStorage.getItem('lang')).toBe('en');
        expect(screen.getByText('Guest ABCDE')).toBeTruthy();
        expect(screen.getByText('1,234')).toBeTruthy();
        expect(screen.getByText('04/03/2026')).toBeTruthy();
        expect(screen.getByText('Player')).toBeTruthy();
    });

    it('switches back to Polish', () => {
        renderApp();
        pressLanguageButton();
        pressLanguageButton();

        expect(screen.getByTestId('probe').textContent).toBe('pl:Ćwiczenia');
        expect(screen.getByText('Gość ABCDE')).toBeTruthy();
        expect(localStorage.getItem('lang')).toBe('pl');
    });

    it('restores the stored language and ignores junk values', () => {
        localStorage.setItem('lang', 'en');
        const first = renderApp();
        expect(screen.getByTestId('probe').textContent).toBe('en:Practice');
        first.unmount();

        localStorage.setItem('lang', 'de');
        renderApp();
        expect(screen.getByTestId('probe').textContent).toBe('pl:Ćwiczenia');
    });
});
