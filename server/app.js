const express = require('express');
const Database = require('better-sqlite3');

const MAX_SCORE = 100000;
const MAX_NAME_LEN = 40;
const MAX_STR_LEN = 100;
const SUBMIT_INTERVAL_MS = 2000;

function clampString(value, maxLen) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLen);
}

// Builds a fresh Express app + SQLite connection against dbPath. Used as the
// real entrypoint (a file on disk) and by tests (':memory:' for isolation).
function createApp(dbPath) {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT NOT NULL,
      category_name TEXT NOT NULL,
      player_name TEXT NOT NULL,
      score REAL NOT NULL,
      difficulty TEXT,
      school_level TEXT,
      updated_at TEXT NOT NULL,
      UNIQUE(client_id, category_name)
    );
  `);

  // Minimal per-IP throttle: one submission every 2s. Good enough to deter
  // trivial spam without adding an extra dependency for a low-traffic app.
  const lastSubmitByIp = new Map();

  const app = express();
  // Sits behind Apache's ProxyPass on the same host — trust only the loopback
  // hop so req.ip reflects the real client via X-Forwarded-For.
  app.set('trust proxy', 'loopback');
  app.use(express.json({ limit: '10kb' }));

  app.get('/leaderboard', (req, res) => {
    const category = clampString(req.query.category, MAX_STR_LEN);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 100);

    const rows = category
      ? db.prepare(
          `SELECT client_id as clientId, player_name as playerName, score, category_name as categoryName,
                  difficulty, school_level as schoolLevel, updated_at as date
           FROM scores WHERE category_name = ? ORDER BY score DESC, updated_at DESC LIMIT ?`
        ).all(category, limit)
      : db.prepare(
          `SELECT client_id as clientId, player_name as playerName, score, category_name as categoryName,
                  difficulty, school_level as schoolLevel, updated_at as date
           FROM scores ORDER BY score DESC, updated_at DESC LIMIT ?`
        ).all(limit);

    res.json(rows.map((row) => ({ ...row, id: `${row.clientId}-${row.categoryName}` })));
  });

  app.get('/leaderboard/mine', (req, res) => {
    const clientId = clampString(req.query.clientId, 64);
    const category = clampString(req.query.category, MAX_STR_LEN);
    if (!clientId || !category) return res.status(400).json({ error: 'Missing clientId or category.' });

    const row = db.prepare(
      `SELECT client_id as clientId, player_name as playerName, score, category_name as categoryName,
              difficulty, school_level as schoolLevel, updated_at as date
       FROM scores WHERE client_id = ? AND category_name = ?`
    ).get(clientId, category);

    res.json(row ? { ...row, id: `${row.clientId}-${row.categoryName}` } : null);
  });

  app.post('/leaderboard', (req, res) => {
    const ip = req.ip;
    const now = Date.now();
    const last = lastSubmitByIp.get(ip) || 0;
    if (now - last < SUBMIT_INTERVAL_MS) {
      return res.status(429).json({ error: 'Too many submissions, slow down.' });
    }

    const clientId = clampString(req.body.clientId, 64);
    const categoryName = clampString(req.body.categoryName, MAX_STR_LEN);
    const playerName = clampString(req.body.playerName, MAX_NAME_LEN) || 'Gość';
    const difficulty = clampString(req.body.difficulty, 32);
    const schoolLevel = clampString(req.body.schoolLevel, 32);
    const score = Number(req.body.score);

    if (!clientId || !categoryName || !Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
      return res.status(400).json({ error: 'Invalid payload.' });
    }

    lastSubmitByIp.set(ip, now);
    // Prune the throttle map occasionally so it doesn't grow unbounded.
    if (lastSubmitByIp.size > 5000) {
      for (const [key, ts] of lastSubmitByIp) {
        if (now - ts > 60000) lastSubmitByIp.delete(key);
      }
    }

    const updatedAt = new Date().toISOString();
    db.prepare(
      `INSERT INTO scores (client_id, category_name, player_name, score, difficulty, school_level, updated_at)
       VALUES (@clientId, @categoryName, @playerName, @score, @difficulty, @schoolLevel, @updatedAt)
       ON CONFLICT(client_id, category_name) DO UPDATE SET
         player_name = excluded.player_name,
         score = excluded.score,
         difficulty = excluded.difficulty,
         school_level = excluded.school_level,
         updated_at = excluded.updated_at
       WHERE excluded.score > scores.score`
    ).run({ clientId, categoryName, playerName, score, difficulty, schoolLevel, updatedAt });

    // A weaker run leaves the previous score in place, so report what is stored
    // rather than what was sent.
    const stored = db.prepare(
      `SELECT player_name, score, difficulty, school_level, updated_at
       FROM scores WHERE client_id = ? AND category_name = ?`
    ).get(clientId, categoryName);

    res.status(201).json({
      id: `${clientId}-${categoryName}`,
      clientId,
      categoryName,
      playerName: stored.player_name,
      score: stored.score,
      difficulty: stored.difficulty,
      schoolLevel: stored.school_level,
      date: stored.updated_at,
    });
  });

  app.get('/health', (_req, res) => res.json({ ok: true }));

  return { app, db };
}

module.exports = { createApp };
