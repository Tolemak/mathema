import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LeaderboardTable, { LeaderboardEntry } from './LeaderboardTable';

const entry = (overrides: Partial<LeaderboardEntry>): LeaderboardEntry => ({
    id: 1,
    playerName: 'Gość AAAAA',
    score: 10,
    categoryId: 'algebra',
    categoryName: 'Algebra',
    date: '2026-01-01T00:00:00.000Z',
    mine: false,
    ...overrides,
});

describe('LeaderboardTable', () => {
    afterEach(cleanup);

    it('renders player names as text, never as markup', () => {
        const payload = '<img src=x onerror="alert(1)">';
        const { container } = render(<LeaderboardTable entries={[entry({ playerName: payload })]} />);

        expect(screen.getByText(payload)).toBeTruthy();
        expect(container.querySelector('img')).toBeNull();
    });

    it('highlights only the rows owned by the viewer', () => {
        const { container } = render(
            <LeaderboardTable entries={[entry({ id: 1, score: 30 }), entry({ id: 2, playerName: 'Gość BBBBB', mine: true })]} />,
        );

        const highlighted = container.querySelectorAll('.highlighted-player');
        expect(highlighted).toHaveLength(1);
        expect(highlighted[0].textContent).toContain('Gość BBBBB');
    });

    it('shows a placeholder when there are no entries', () => {
        render(<LeaderboardTable entries={[]} />);
        expect(screen.getByText('Brak wyników do wyświetlenia.')).toBeTruthy();
    });
});
