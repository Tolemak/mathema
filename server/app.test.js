import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, PLAYER_COOKIE } from './app.js';
import { openDatabase } from './db.js';
import { ROUND_TTL_MS } from './leaderboard.js';

const START = Date.UTC(2026, 0, 1);

function setup(options = {}) {
  let clock = START;
  const db = openDatabase(':memory:');
  const app = createApp({ db, now: () => clock, ...options });
  return { db, app, advance: (ms) => { clock += ms; } };
}

function playerCookie(res) {
  const header = (res.headers['set-cookie'] ?? []).find((cookie) => cookie.startsWith(`${PLAYER_COOKIE}=`));
  return header ? header.split(';')[0] : null;
}

describe('mathema leaderboard API', () => {
  let ctx;

  beforeEach(() => {
    ctx = setup();
  });

  afterEach(() => {
    ctx.db.close();
  });

  const startRound = async (categoryId = 'algebra') => {
    const res = await request(ctx.app).post('/rounds').send({ categoryId });
    expect(res.status).toBe(201);
    return res.body.roundId;
  };

  const answer = (roundId, questionId, correct = true) =>
    request(ctx.app).post(`/rounds/${roundId}/answers`).send({ questionId, correct });

  const finish = (roundId, cookie) => {
    const req = request(ctx.app).post(`/rounds/${roundId}/finish`);
    return cookie ? req.set('Cookie', cookie) : req;
  };

  async function playRound(answers, cookie) {
    const roundId = await startRound();
    for (const [questionId, seconds] of answers) {
      ctx.advance(seconds * 1000);
      expect((await answer(roundId, questionId)).status).toBe(200);
    }
    return finish(roundId, cookie);
  }

  describe('basics', () => {
    it('reports health', async () => {
      const res = await request(ctx.app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it('sends security headers', async () => {
      const res = await request(ctx.app).get('/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-security-policy']).toContain("default-src 'none'");
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('answers unknown routes with a JSON 404', async () => {
      const res = await request(ctx.app).get('/nope');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Not found.' });
    });

    it('no longer accepts client-submitted scores', async () => {
      const res = await request(ctx.app).post('/leaderboard').send({ clientId: 'x', categoryName: 'Algebra', score: 99999 });
      expect(res.status).toBe(404);
    });

    it('rejects malformed JSON without leaking details', async () => {
      const res = await request(ctx.app).post('/rounds').set('Content-Type', 'application/json').send('{"categoryId":');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Bad Request' });
      expect(res.text).not.toContain('at ');
    });

    it('rejects oversized bodies', async () => {
      const res = await request(ctx.app).post('/rounds').send({ categoryId: 'a'.repeat(5000) });
      expect(res.status).toBe(413);
      expect(res.body).toEqual({ error: 'Payload Too Large' });
    });

    it('hides unexpected errors behind a generic 500', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      ctx.db.close();
      const res = await request(ctx.app).post('/rounds').send({ categoryId: 'algebra' });
      spy.mockRestore();
      ctx.db = openDatabase(':memory:');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('rounds', () => {
    it('rejects an unknown category', async () => {
      const res = await request(ctx.app).post('/rounds').send({ categoryId: 'Algebra' });
      expect(res.status).toBe(400);
    });

    it('scores answers with server-side timing', async () => {
      const roundId = await startRound();

      const fast = await answer(roundId, 'alg1');
      expect(fast.body).toEqual({ points: 24, score: 24 });

      ctx.advance(30_000);
      const slow = await answer(roundId, 'alg3');
      expect(slow.body).toEqual({ points: 12, score: 36 });
    });

    it('ignores any score the client tries to send', async () => {
      const roundId = await startRound();
      const res = await request(ctx.app)
        .post(`/rounds/${roundId}/answers`)
        .send({ questionId: 'alg1', correct: true, points: 5000, score: 5000 });
      expect(res.body.score).toBe(24);
    });

    it('gives no points for a wrong answer but restarts the timer', async () => {
      const roundId = await startRound();
      ctx.advance(20_000);
      expect((await answer(roundId, 'alg1', false)).body).toEqual({ points: 0, score: 0 });
      expect((await answer(roundId, 'alg3')).body).toEqual({ points: 24, score: 24 });
    });

    it('rejects questions from another category and invalid payloads', async () => {
      const roundId = await startRound();
      expect((await answer(roundId, 'geo1')).status).toBe(400);
      expect((await answer(roundId, 'missing')).status).toBe(400);
      expect((await request(ctx.app).post(`/rounds/${roundId}/answers`).send({ questionId: 'alg1', correct: 'yes' })).status).toBe(400);
      expect((await request(ctx.app).post(`/rounds/${roundId}/answers`).send({ questionId: ['alg1'], correct: true })).status).toBe(400);
    });

    it('counts each question once per round', async () => {
      const roundId = await startRound();
      await answer(roundId, 'alg1');
      const again = await answer(roundId, 'alg1');
      expect(again.status).toBe(409);
    });

    it('returns 404 for unknown, malformed or expired rounds', async () => {
      expect((await answer('A'.repeat(22), 'alg1')).status).toBe(404);
      expect((await answer('../../etc', 'alg1')).status).toBe(404);

      const roundId = await startRound();
      ctx.advance(ROUND_TTL_MS + 1);
      expect((await answer(roundId, 'alg1')).status).toBe(404);
      expect((await finish(roundId)).status).toBe(404);
    });

    it('cannot be finished twice', async () => {
      const roundId = await startRound();
      await answer(roundId, 'alg1');
      expect((await finish(roundId)).status).toBe(200);
      expect((await finish(roundId)).status).toBe(404);
    });
  });

  describe('finishing a round', () => {
    it('creates a guest player with a server-issued name and an HttpOnly cookie', async () => {
      const res = await playRound([['alg1', 0]]);

      expect(res.status).toBe(200);
      expect(res.body.roundScore).toBe(24);
      expect(res.body.entry).toMatchObject({ score: 24, categoryId: 'algebra', categoryName: 'Algebra', mine: true });
      expect(res.body.entry.playerName).toMatch(/^Gość [A-HJ-NP-Z2-9]{5}$/);

      const cookie = res.headers['set-cookie'].find((c) => c.startsWith(`${PLAYER_COOKIE}=`));
      expect(cookie).toMatch(/HttpOnly/);
      expect(cookie).toMatch(/Secure/);
      expect(cookie).toMatch(/SameSite=Strict/);
    });

    it('does not create a player for an empty round', async () => {
      const roundId = await startRound();
      await answer(roundId, 'alg1', false);
      const res = await finish(roundId);

      expect(res.body).toEqual({ roundScore: 0, entry: null });
      expect(playerCookie(res)).toBeNull();
    });

    it('keeps the best round instead of adding rounds together', async () => {
      const first = await playRound([['alg1', 0]]);
      const cookie = playerCookie(first);

      const weaker = await playRound([['alg1', 30]], cookie);
      expect(weaker.body.roundScore).toBe(12);
      expect(weaker.body.entry.score).toBe(24);
      expect(playerCookie(weaker)).toBeNull();

      const better = await playRound([['alg1', 0], ['alg3', 0]], cookie);
      expect(better.body.roundScore).toBe(48);
      expect(better.body.entry.score).toBe(48);

      const board = await request(ctx.app).get('/leaderboard?category=algebra');
      expect(board.body).toHaveLength(1);
      expect(board.body[0].score).toBe(48);
    });
  });

  describe('GET /leaderboard', () => {
    it('lists entries without exposing player secrets and flags only my rows', async () => {
      const mine = playerCookie(await playRound([['alg1', 0]]));
      await playRound([['alg1', 0], ['alg3', 0]]);

      const res = await request(ctx.app).get('/leaderboard?category=algebra').set('Cookie', mine);
      expect(res.body.map((e) => e.score)).toEqual([48, 24]);
      expect(res.body.map((e) => e.mine)).toEqual([false, true]);
      for (const entry of res.body) {
        expect(Object.keys(entry).sort()).toEqual(['categoryId', 'categoryName', 'date', 'id', 'mine', 'playerName', 'score']);
      }

      const anonymous = await request(ctx.app).get('/leaderboard');
      expect(anonymous.body.every((e) => e.mine === false)).toBe(true);
    });

    it('filters by category and clamps the limit', async () => {
      await playRound([['alg1', 0]]);

      expect((await request(ctx.app).get('/leaderboard?category=geometry')).body).toEqual([]);
      expect((await request(ctx.app).get('/leaderboard?limit=0')).body).toHaveLength(1);
      expect((await request(ctx.app).get('/leaderboard?limit=abc')).body).toHaveLength(1);
    });

    it('rejects an unknown category', async () => {
      expect((await request(ctx.app).get('/leaderboard?category=nope')).status).toBe(400);
      expect((await request(ctx.app).get('/leaderboard?category=a&category=b')).status).toBe(400);
    });
  });

  describe('GET /leaderboard/mine', () => {
    it("returns the caller's own entry", async () => {
      const cookie = playerCookie(await playRound([['alg1', 0]]));
      const res = await request(ctx.app).get('/leaderboard/mine?category=algebra').set('Cookie', `theme=dark; ${cookie}`);
      expect(res.body).toMatchObject({ score: 24, mine: true });
    });

    it('returns null without a valid player cookie', async () => {
      await playRound([['alg1', 0]]);
      expect((await request(ctx.app).get('/leaderboard/mine?category=algebra')).body).toBeNull();
      expect((await request(ctx.app).get('/leaderboard/mine?category=algebra').set('Cookie', `${PLAYER_COOKIE}=forged`)).body).toBeNull();
      expect((await request(ctx.app).get('/leaderboard/mine?category=algebra').set('Cookie', `${PLAYER_COOKIE}=${'A'.repeat(43)}`)).body).toBeNull();
    });

    it('rejects a missing category', async () => {
      expect((await request(ctx.app).get('/leaderboard/mine')).status).toBe(400);
    });
  });

  describe('rate limiting behind proxies', () => {
    beforeEach(() => {
      ctx.db.close();
      ctx = setup({ limits: { rounds: { limit: 1 } } });
    });

    const start = (forwardedFor) => {
      const req = request(ctx.app).post('/rounds');
      if (forwardedFor) req.set('X-Forwarded-For', forwardedFor);
      return req.send({ categoryId: 'algebra' });
    };

    it('throttles a single client', async () => {
      expect((await start()).status).toBe(201);
      const second = await start();
      expect(second.status).toBe(429);
      expect(second.body).toEqual({ error: 'Too many requests.' });
    });

    it('tells clients apart by the address forwarded through Cloudflare', async () => {
      expect((await start('198.51.100.7, 173.245.48.10')).status).toBe(201);
      expect((await start('198.51.100.8, 173.245.48.10')).status).toBe(201);
      expect((await start('198.51.100.7, 173.245.48.11')).status).toBe(429);
    });

    it('ignores addresses a client prepends to X-Forwarded-For', async () => {
      expect((await start('10.0.0.1, 203.0.113.5')).status).toBe(201);
      expect((await start('10.0.0.2, 203.0.113.5')).status).toBe(429);
    });
  });
});
