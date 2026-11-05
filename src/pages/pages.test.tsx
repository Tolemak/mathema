import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import BrowseModePage from './BrowseModePage';
import LeaderboardPage from './LeaderboardPage';
import NotFoundPage from './NotFoundPage';
import PracticeAreaPage from './PracticeAreaPage';
import ProgressPage from './ProgressPage';
import WelcomePage from './WelcomePage';
import * as api from '../utils/leaderboardApi';

vi.mock('../utils/leaderboardApi', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../utils/leaderboardApi')>()),
    fetchLeaderboard: vi.fn(),
}));

const Where = () => <p data-testid="where">{useLocation().pathname}</p>;

const renderAt = (path: string, element: React.ReactElement, route = path.split('?')[0]) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path={route} element={element} />
                <Route path="*" element={<Where />} />
            </Routes>
        </MemoryRouter>,
    );

const where = () => screen.getByTestId('where').textContent;

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe('static pages', () => {
    it('renders the progress page with a link to the leaderboard', () => {
        renderAt('/progress', <ProgressPage />);
        expect(screen.getByRole('link').getAttribute('href')).toBe('/leaderboard');
    });

    it('renders the welcome page with practice links and a daily task', () => {
        renderAt('/', <WelcomePage />);
        const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
        expect(hrefs).toEqual(expect.arrayContaining(['/practice?mode=interactive', '/practice?mode=browse', '/leaderboard']));
        expect(screen.getByRole('button', { name: 'Sprawdź' })).toBeTruthy();
    });

    it('lets the daily task be answered and replaced', () => {
        renderAt('/', <WelcomePage />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz-wrong' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sprawdź' }));
        expect(document.querySelector('.worked-answer')).not.toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Następne zadanie' }));
        expect(document.querySelector('.worked-answer')).toBeNull();
        expect(screen.getByRole('button', { name: 'Sprawdź' })).toBeTruthy();
    });

    it('marks the not found page as noindex only while mounted', () => {
        const { unmount } = renderAt('/nope', <NotFoundPage />);
        expect(document.head.querySelector('meta[name="robots"][content="noindex"]')).not.toBeNull();
        unmount();
        expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
    });
});

describe('LeaderboardPage', () => {
    it('shows the loaded entries', async () => {
        vi.mocked(api.fetchLeaderboard).mockResolvedValue([
            { id: 1, playerName: 'Gość ZZZZZ', score: 77, categoryId: 'algebra', categoryName: 'Algebra', date: '2026-01-01T00:00:00.000Z', mine: false },
        ]);
        renderAt('/leaderboard', <LeaderboardPage />);
        expect(await screen.findByText('Gość ZZZZZ')).toBeTruthy();
    });

    it('distinguishes rate limiting from other failures', async () => {
        vi.mocked(api.fetchLeaderboard).mockRejectedValueOnce(new api.ApiError('/leaderboard', 429));
        const first = renderAt('/leaderboard', <LeaderboardPage />);
        const limited = (await first.findByText(/.+/, { selector: '.error-text' })).textContent;
        first.unmount();

        vi.mocked(api.fetchLeaderboard).mockRejectedValueOnce(new Error('boom'));
        const second = renderAt('/leaderboard', <LeaderboardPage />);
        const failed = (await second.findByText(/.+/, { selector: '.error-text' })).textContent;
        expect(limited).not.toBe(failed);
    });
});

describe('PracticeAreaPage', () => {
    const openAllLevels = () =>
        document.querySelectorAll<HTMLButtonElement>('.school-level-title button').forEach((button) => fireEvent.click(button));

    const pickAlgebra = () => {
        openAllLevels();
        fireEvent.click(screen.getAllByRole('button', { name: 'Algebra' })[0]);
    };

    it('browses a category by default', () => {
        renderAt('/practice', <PracticeAreaPage />);
        pickAlgebra();
        expect(where()).toBe('/practice/browse/algebra');
    });

    it('starts interactive practice when the URL asks for it', () => {
        renderAt('/practice?mode=interactive', <PracticeAreaPage />);
        pickAlgebra();
        expect(where()).toBe('/practice/interactive/algebra');
    });

    it('switches mode with the toggle buttons', () => {
        renderAt('/practice', <PracticeAreaPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Ćwiczenie na punkty' }));
        pickAlgebra();
        expect(where()).toBe('/practice/interactive/algebra');
        cleanup();

        renderAt('/practice?mode=interactive', <PracticeAreaPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Przeglądanie z odpowiedziami' }));
        pickAlgebra();
        expect(where()).toBe('/practice/browse/algebra');
    });

    it('filters sections by search and collapses a level', () => {
        renderAt('/practice', <PracticeAreaPage />);
        const search = screen.getByLabelText('Szukaj działu');
        fireEvent.change(search, { target: { value: 'zzzz-nothing' } });
        expect(screen.getByText('Żaden dział nie pasuje do wyszukiwania.')).toBeTruthy();

        fireEvent.change(search, { target: { value: 'algebra' } });
        const toggle = document.querySelector<HTMLButtonElement>('.school-level-title button')!;
        fireEvent.click(toggle);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getAllByRole('button', { name: 'Algebra' }).length).toBe(1);
        fireEvent.click(toggle);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });
});

describe('BrowseModePage', () => {
    const at = (id: string) => renderAt(`/practice/browse/${id}`, <BrowseModePage />, '/practice/browse/:categoryId');
    const count = () => document.querySelectorAll('.question-item-browse').length;

    it('toggles answers', () => {
        at('trigonometry');
        expect(count()).toBe(20);

        fireEvent.click(screen.getAllByRole('button', { name: 'Pokaż odpowiedź' })[0]);
        expect(document.querySelector('.answer-text')).not.toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Ukryj odpowiedź' }));
        expect(document.querySelector('.answer-text')).toBeNull();
    });

    it('filters by level and difficulty and clears the filters', () => {
        at('trigonometry');
        fireEvent.change(screen.getByLabelText('Poziom:'), { target: { value: 'liceum_podst' } });
        const podstawowa = count();
        expect(podstawowa).toBeGreaterThan(0);
        expect(podstawowa).toBeLessThan(20);

        fireEvent.change(screen.getByLabelText('Trudność:'), { target: { value: 'trudne' } });
        expect(count()).toBe(0);
        expect(screen.getByText(/Brak zadań/)).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: 'Wyczyść filtry' }));
        expect(count()).toBe(20);
        expect(screen.queryByRole('button', { name: 'Wyczyść filtry' })).toBeNull();
    });

    it('redirects an unknown category to the practice list', async () => {
        at('does-not-exist');
        await waitFor(() => expect(where()).toBe('/practice'));
    });
});
