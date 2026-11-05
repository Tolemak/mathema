import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from './app.js';
import { isAnswerCorrect as serverCheck } from './answerCheck.js';
import { openDatabase } from './db.js';
import { categories } from './questionBank.js';
import { isAnswerCorrect as clientCheck } from '../src/utils/answerCheck.ts';
import { finishRound, startRound, submitAnswer } from '../src/utils/leaderboardApi.ts';

describe('frontend and server contract', () => {
  let db;
  let app;
  let clock;
  const sent = [];

  beforeEach(() => {
    clock = Date.UTC(2026, 0, 1);
    sent.length = 0;
    db = openDatabase(':memory:');
    app = createApp({ db, now: () => clock });
    vi.stubGlobal('fetch', async (url, init) => {
      const path = url.replace(/^\/api/, '');
      const method = init.method.toLowerCase();
      sent.push({ path, body: init.body === undefined ? undefined : JSON.parse(init.body) });
      let req = request(app)[method](path);
      if (init.headers) req = req.set(init.headers);
      const res = await (init.body === undefined ? req : req.send(init.body));
      return new Response(JSON.stringify(res.body), { status: res.status });
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    db.close();
  });

  it('accepts exactly the request the frontend builds and scores it server-side', async () => {
    const roundId = await startRound('algebra');
    expect(await submitAnswer(roundId, 'alg1', '3')).toEqual({ points: 24, score: 24 });
    expect(await submitAnswer(roundId, 'alg3', 'nonsense')).toEqual({ points: 0, score: 24 });

    expect(sent[1].body).toEqual({ questionId: 'alg1', answer: '3' });
    expect(Object.keys(sent[2].body).sort()).toEqual(['answer', 'questionId']);
    expect((await finishRound(roundId)).roundScore).toBe(24);
  });

  it('rejects the legacy request shape with a client-side verdict', async () => {
    const roundId = await startRound('algebra');
    const res = await request(app).post(`/rounds/${roundId}/answers`).send({ questionId: 'alg1', correct: true });
    expect(res.status).toBe(400);
  });

  it('judges every bank answer and near-miss like the frontend does', () => {
    for (const { questions } of categories) {
      for (const { answer } of questions) {
        const variants = [String(answer), ` ${String(answer).toUpperCase()} `, String(answer).replace('.', ','), '', 'xyz', `${answer}0`];
        for (const given of variants) expect(serverCheck(answer, given), `${answer} <- ${given}`).toBe(clientCheck(answer, given));
      }
    }
  });
});
