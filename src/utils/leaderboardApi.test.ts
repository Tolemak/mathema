import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchLeaderboard, fetchMyEntry, finishRound, startRound, submitAnswer } from './leaderboardApi';

const fetchMock = vi.fn();

const respond = (body: unknown, status = 200) =>
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status }));

describe('leaderboardApi', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        fetchMock.mockReset();
    });

    it('queries the leaderboard by category id', async () => {
        respond([]);
        await fetchLeaderboard('algebra', 10);
        expect(fetchMock).toHaveBeenCalledWith('/api/leaderboard?limit=10&category=algebra', undefined);

        respond(null);
        await fetchMyEntry('algebra');
        expect(fetchMock).toHaveBeenLastCalledWith('/api/leaderboard/mine?category=algebra', undefined);
    });

    it('drives a round without ever sending a score', async () => {
        respond({ roundId: 'r1' });
        expect(await startRound('algebra')).toBe('r1');

        respond({ points: 24, score: 24 });
        await submitAnswer('r1', 'alg1', true);

        respond({ roundScore: 24, entry: null });
        await finishRound('r1');

        const calls = fetchMock.mock.calls.map(([url, init]) => [url, init.method, init.body]);
        expect(calls).toEqual([
            ['/api/rounds', 'POST', JSON.stringify({ categoryId: 'algebra' })],
            ['/api/rounds/r1/answers', 'POST', JSON.stringify({ questionId: 'alg1', correct: true })],
            ['/api/rounds/r1/finish', 'POST', undefined],
        ]);
    });

    it('throws on error responses', async () => {
        respond({ error: 'Too many requests.' }, 429);
        await expect(startRound('algebra')).rejects.toThrow('429');
    });
});
