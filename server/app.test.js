const request = require('supertest');
const { createApp } = require('./app');

describe('mathema leaderboard API', () => {
  let app;
  let db;

  beforeEach(() => {
    ({ app, db } = createApp(':memory:'));
  });

  afterEach(() => {
    db.close();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });
  });

  describe('POST /leaderboard', () => {
    it('rejects a payload missing clientId or categoryName', async () => {
      const res = await request(app).post('/leaderboard').send({ score: 10 });
      expect(res.status).toBe(400);
    });

    it('rejects a non-finite or out-of-range score', async () => {
      const base = { clientId: 'c1', categoryName: 'Algebra' };
      const tooHigh = await request(app).post('/leaderboard').send({ ...base, score: 999999 });
      expect(tooHigh.status).toBe(400);

      const negative = await request(app).post('/leaderboard').send({ ...base, score: -5 });
      expect(negative.status).toBe(400);

      const notANumber = await request(app).post('/leaderboard').send({ ...base, score: 'abc' });
      expect(notANumber.status).toBe(400);
    });

    it('accepts a valid submission and echoes it back', async () => {
      const res = await request(app).post('/leaderboard').send({
        clientId: 'guest_1',
        categoryName: 'Algebra',
        playerName: 'Test',
        score: 42.5,
        difficulty: 'srednie',
        schoolLevel: 'liceum_podst',
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        clientId: 'guest_1',
        categoryName: 'Algebra',
        playerName: 'Test',
        score: 42.5,
      });
    });

    it('falls back to a default player name when none is given', async () => {
      const res = await request(app)
        .post('/leaderboard')
        .send({ clientId: 'guest_2', categoryName: 'Algebra', score: 5 });
      expect(res.status).toBe(201);
      expect(res.body.playerName).toBe('Gość');
    });

    it('upserts: a second submission for the same client+category replaces the first', async () => {
      await request(app).post('/leaderboard').send({ clientId: 'guest_3', categoryName: 'Algebra', score: 10 });

      vi.useFakeTimers();
      vi.advanceTimersByTime(3000); // clear the per-IP throttle window
      const res = await request(app)
        .post('/leaderboard')
        .send({ clientId: 'guest_3', categoryName: 'Algebra', score: 20, playerName: 'Updated' });
      vi.useRealTimers();

      expect(res.status).toBe(201);
      const listRes = await request(app).get('/leaderboard?category=Algebra');
      expect(listRes.body).toHaveLength(1);
      expect(listRes.body[0]).toMatchObject({ score: 20, playerName: 'Updated' });
    });

    it('throttles rapid submissions from the same IP', async () => {
      const first = await request(app)
        .post('/leaderboard')
        .send({ clientId: 'guest_4', categoryName: 'Algebra', score: 1 });
      expect(first.status).toBe(201);

      const second = await request(app)
        .post('/leaderboard')
        .send({ clientId: 'guest_5', categoryName: 'Algebra', score: 1 });
      expect(second.status).toBe(429);
    });

    it('allows a submission again once the throttle window has passed', async () => {
      await request(app).post('/leaderboard').send({ clientId: 'guest_6', categoryName: 'Algebra', score: 1 });

      vi.useFakeTimers();
      vi.advanceTimersByTime(2100);
      const res = await request(app)
        .post('/leaderboard')
        .send({ clientId: 'guest_7', categoryName: 'Algebra', score: 1 });
      vi.useRealTimers();

      expect(res.status).toBe(201);
    });
  });

  describe('GET /leaderboard', () => {
    async function seed(entries) {
      vi.useFakeTimers();
      try {
        for (const entry of entries) {
          await request(app).post('/leaderboard').send(entry);
          vi.advanceTimersByTime(2100);
        }
      } finally {
        vi.useRealTimers();
      }
    }

    it('returns entries sorted by score descending', async () => {
      await seed([
        { clientId: 'a', categoryName: 'Algebra', score: 10 },
        { clientId: 'b', categoryName: 'Algebra', score: 30 },
        { clientId: 'c', categoryName: 'Algebra', score: 20 },
      ]);

      const res = await request(app).get('/leaderboard?category=Algebra');
      expect(res.body.map((e) => e.score)).toEqual([30, 20, 10]);
    });

    it('filters by category', async () => {
      await seed([
        { clientId: 'a', categoryName: 'Algebra', score: 10 },
        { clientId: 'b', categoryName: 'Geometria', score: 99 },
      ]);

      const res = await request(app).get('/leaderboard?category=Algebra');
      expect(res.body).toHaveLength(1);
      expect(res.body[0].categoryName).toBe('Algebra');
    });

    it('returns entries across all categories when none is given', async () => {
      await seed([
        { clientId: 'a', categoryName: 'Algebra', score: 10 },
        { clientId: 'b', categoryName: 'Geometria', score: 99 },
      ]);

      const res = await request(app).get('/leaderboard');
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /leaderboard/mine', () => {
    it('returns 400 when clientId or category is missing', async () => {
      const res = await request(app).get('/leaderboard/mine?clientId=guest_1');
      expect(res.status).toBe(400);
    });

    it('returns null when the client has no entry for that category', async () => {
      const res = await request(app).get('/leaderboard/mine?clientId=guest_1&category=Algebra');
      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });

    it("returns the client's own entry even if it isn't in the top results", async () => {
      await request(app).post('/leaderboard').send({ clientId: 'guest_low', categoryName: 'Algebra', score: 1 });

      const res = await request(app).get('/leaderboard/mine?clientId=guest_low&category=Algebra');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ clientId: 'guest_low', score: 1 });
    });
  });
});
