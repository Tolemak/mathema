import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import InteractiveModePage from './InteractiveModePage';
import * as api from '../utils/leaderboardApi';
import type { LeaderboardEntry } from '../components/LeaderboardTable';

vi.mock('../data/mathProblems', () => ({
    categories: [{
        id: 'demo',
        name: 'Demo',
        questions: [
            { id: 'q1', text: 'Ile to 2 + 2?', answer: 4, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'q2', text: 'Ile to 3 + 3?', answer: 6, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
        ],
    }],
}));

vi.mock('../utils/leaderboardApi', () => ({
    fetchLeaderboard: vi.fn(),
    fetchMyEntry: vi.fn(),
    startRound: vi.fn(),
    submitAnswer: vi.fn(),
    finishRound: vi.fn(),
}));

const entry = (overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry => ({
    id: 1,
    playerName: 'Gość ABCDE',
    score: 500,
    categoryId: 'demo',
    categoryName: 'Demo',
    date: '2026-01-01T00:00:00.000Z',
    mine: true,
    ...overrides,
});

const answers: Record<string, string> = { 'Ile to 2 + 2?': '4', 'Ile to 3 + 3?': '6' };

function answerCurrentQuestion() {
    const text = screen.getByRole('heading', { level: 2 }).textContent ?? '';
    fireEvent.change(screen.getByPlaceholderText('Twoja odpowiedź'), { target: { value: answers[text] } });
    fireEvent.click(screen.getByRole('button', { name: 'Zatwierdź' }));
}

function renderAt(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/practice/interactive/:categoryId" element={<InteractiveModePage />} />
                <Route path="/practice" element={<p>Wybór kategorii</p>} />
            </Routes>
        </MemoryRouter>,
    );
}

const currentScore = () => Number(screen.getByText(/^Wynik: /).textContent?.replace('Wynik: ', ''));

describe('InteractiveModePage', () => {
    beforeEach(() => {
        vi.mocked(api.fetchLeaderboard).mockResolvedValue([]);
        vi.mocked(api.fetchMyEntry).mockResolvedValue(entry());
        vi.mocked(api.startRound).mockResolvedValue('round-1');
        vi.mocked(api.submitAnswer).mockResolvedValue({ points: 20, score: 20 });
        vi.mocked(api.finishRound).mockResolvedValue({ roundScore: 40, entry: entry() });
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('starts every session from zero instead of the saved best score', async () => {
        renderAt('/practice/interactive/demo');
        expect(await screen.findByText('Twój najlepszy wynik w tej kategorii: 500')).toBeTruthy();
        expect(currentScore()).toBe(0);

        answerCurrentQuestion();

        expect(currentScore()).toBeGreaterThan(0);
        expect(currentScore()).toBeLessThanOrEqual(20);
    });

    it('reports answers to the round and lets the server compute the saved score', async () => {
        renderAt('/practice/interactive/demo');
        await waitFor(() => expect(api.startRound).toHaveBeenCalledWith('demo'));

        answerCurrentQuestion();
        answerCurrentQuestion();

        expect(await screen.findByText('Wynik zapisany na tablicy.')).toBeTruthy();
        expect(vi.mocked(api.submitAnswer).mock.calls.map(([round, , correct]) => [round, correct])).toEqual([
            ['round-1', true],
            ['round-1', true],
        ]);
        expect(api.finishRound).toHaveBeenCalledWith('round-1');
        expect(document.querySelector('.highlighted-player')?.textContent).toContain('Gość ABCDE');
    });

    it('keeps the game playable when the API is down', async () => {
        vi.mocked(api.startRound).mockRejectedValue(new Error('offline'));
        vi.mocked(api.fetchMyEntry).mockRejectedValue(new Error('offline'));
        renderAt('/practice/interactive/demo');

        answerCurrentQuestion();
        answerCurrentQuestion();

        expect(await screen.findByText('Nie udało się zapisać wyniku.')).toBeTruthy();
        expect(api.submitAnswer).not.toHaveBeenCalled();
        expect(api.finishRound).not.toHaveBeenCalled();
    });

    it('starts a fresh round on restart', async () => {
        renderAt('/practice/interactive/demo');
        answerCurrentQuestion();
        answerCurrentQuestion();
        await screen.findByText('Wynik zapisany na tablicy.');

        fireEvent.click(screen.getByRole('button', { name: 'Spróbuj ponownie tę kategorię' }));

        expect(currentScore()).toBe(0);
        await waitFor(() => expect(api.startRound).toHaveBeenCalledTimes(2));
    });

    it('redirects to the category list for an unknown category', () => {
        renderAt('/practice/interactive/nope');
        expect(screen.getByText('Wybór kategorii')).toBeTruthy();
    });
});
