import { STATUS_CODES } from 'node:http';
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createLeaderboard } from './leaderboard.js';
import { findCategory } from './questionBank.js';
import { DEFAULT_TRUST_PROXY } from './trustProxy.js';

export const PLAYER_COOKIE = 'mathema_player';

const PLAYER_COOKIE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
const ROUND_ID_PATTERN = /^[A-Za-z0-9_-]{22}$/;
const PLAYER_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const MAX_LIMIT = 100;

const DEFAULT_LIMITS = {
  rounds: { windowMs: 10 * 60 * 1000, limit: 300 },
  answers: { windowMs: 10 * 60 * 1000, limit: 5000 },
  reads: { windowMs: 60 * 1000, limit: 300 },
};

function limiter({ windowMs, limit }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => res.status(429).json({ error: 'Too many requests.' }),
  });
}

function readCookie(req, name) {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const separator = part.indexOf('=');
    if (separator !== -1 && part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim();
  }
  return null;
}

function parseLimit(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? MAX_LIMIT : Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

function toEntry(row, viewer) {
  return {
    id: row.id,
    playerName: row.player_name,
    score: row.score,
    categoryId: row.category_id,
    categoryName: findCategory(row.category_id)?.name ?? row.category_id,
    date: row.updated_at,
    mine: viewer?.id === row.player_id,
  };
}

const fail = (res, status, error) => res.status(status).json({ error });

export function createApp({ db, now = Date.now, trustProxy = DEFAULT_TRUST_PROXY, limits = {} }) {
  const leaderboard = createLeaderboard(db);
  const limitsFor = (name) => ({ ...DEFAULT_LIMITS[name], ...limits[name] });
  const roundsLimiter = limiter(limitsFor('rounds'));
  const answersLimiter = limiter(limitsFor('answers'));
  const readsLimiter = limiter(limitsFor('reads'));

  const app = express();
  app.set('trust proxy', trustProxy);
  app.use(helmet({
    contentSecurityPolicy: { useDefaults: false, directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
  }));
  app.use(express.json({ limit: '2kb' }));

  app.use((req, res, next) => {
    const token = readCookie(req, PLAYER_COOKIE);
    req.player = token && PLAYER_TOKEN_PATTERN.test(token) ? leaderboard.findPlayer(token) : null;
    next();
  });

  function loadRound(req, res, next) {
    const round = ROUND_ID_PATTERN.test(req.params.roundId) ? leaderboard.findRound(req.params.roundId, now()) : null;
    if (!round) return fail(res, 404, 'Round not found or expired.');
    req.round = round;
    next();
  }

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.get('/leaderboard', readsLimiter, (req, res) => {
    const category = req.query.category === undefined ? null : findCategory(req.query.category);
    if (req.query.category !== undefined && !category) return fail(res, 400, 'Unknown category.');

    const rows = leaderboard.top(category?.id, parseLimit(req.query.limit));
    res.json(rows.map((row) => toEntry(row, req.player)));
  });

  app.get('/leaderboard/mine', readsLimiter, (req, res) => {
    const category = findCategory(req.query.category);
    if (!category) return fail(res, 400, 'Unknown category.');

    const row = req.player ? leaderboard.entryFor(req.player.id, category.id) : null;
    res.json(row ? toEntry(row, req.player) : null);
  });

  app.post('/rounds', roundsLimiter, (req, res) => {
    const category = findCategory(req.body?.categoryId);
    if (!category) return fail(res, 400, 'Unknown category.');

    res.status(201).json({ roundId: leaderboard.startRound(category.id, now()) });
  });

  app.post('/rounds/:roundId/answers', answersLimiter, loadRound, (req, res) => {
    const { questionId, correct } = req.body ?? {};
    const question = typeof questionId === 'string'
      ? findCategory(req.round.category_id)?.questionsById.get(questionId)
      : undefined;
    if (!question || typeof correct !== 'boolean') return fail(res, 400, 'Invalid answer.');

    const result = leaderboard.recordAnswer(req.round, question, correct, now());
    if (!result) return fail(res, 409, 'Question already answered in this round.');
    res.json(result);
  });

  app.post('/rounds/:roundId/finish', roundsLimiter, loadRound, (req, res) => {
    let player = req.player;
    if (!player && Math.round(req.round.score) > 0) {
      const created = leaderboard.createPlayer(now());
      player = created.player;
      res.cookie(PLAYER_COOKIE, created.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: PLAYER_COOKIE_MAX_AGE_MS,
      });
    }

    const roundScore = leaderboard.finishRound(req.round, player?.id, now());
    const row = player ? leaderboard.entryFor(player.id, req.round.category_id) : null;
    res.json({ roundScore, entry: row ? toEntry(row, player) : null });
  });

  app.use((_req, res) => fail(res, 404, 'Not found.'));

  app.use((error, _req, res, _next) => {
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500 ? error.status : 500;
    if (status === 500) console.error(error);
    fail(res, status, STATUS_CODES[status]);
  });

  return app;
}
