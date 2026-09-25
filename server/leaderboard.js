import { createHash, randomBytes, randomInt } from 'node:crypto';
import { pointsFor } from './scoring.js';

export const ROUND_TTL_MS = 2 * 60 * 60 * 1000;

const NAME_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const NAME_SUFFIX_LENGTH = 5;
const NAME_ATTEMPTS = 5;

const ENTRY_COLUMNS = `
  s.id, s.player_id, p.name AS player_name, s.score, s.category_id, s.updated_at
  FROM scores s JOIN players p ON p.id = s.player_id`;

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

function guestName() {
  let suffix = '';
  for (let i = 0; i < NAME_SUFFIX_LENGTH; i++) suffix += NAME_ALPHABET[randomInt(NAME_ALPHABET.length)];
  return `Gość ${suffix}`;
}

export function createLeaderboard(db) {
  const sql = {
    deleteStaleRounds: db.prepare('DELETE FROM rounds WHERE started_at < ?'),
    insertRound: db.prepare('INSERT INTO rounds (id, category_id, started_at) VALUES (?, ?, ?)'),
    findRound: db.prepare('SELECT * FROM rounds WHERE id = ? AND started_at >= ?'),
    insertAnswer: db.prepare('INSERT OR IGNORE INTO round_answers (round_id, question_id) VALUES (?, ?)'),
    addPoints: db.prepare('UPDATE rounds SET score = score + ?, last_answer_at = ? WHERE id = ?'),
    deleteRound: db.prepare('DELETE FROM rounds WHERE id = ?'),
    findPlayer: db.prepare('SELECT id, name FROM players WHERE token_hash = ?'),
    insertPlayer: db.prepare('INSERT INTO players (token_hash, name, created_at) VALUES (?, ?, ?)'),
    saveBest: db.prepare(`
      INSERT INTO scores (player_id, category_id, score, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT (player_id, category_id) DO UPDATE SET score = excluded.score, updated_at = excluded.updated_at
      WHERE excluded.score > scores.score`),
    topInCategory: db.prepare(`SELECT ${ENTRY_COLUMNS} WHERE s.category_id = ? ORDER BY s.score DESC, s.updated_at DESC LIMIT ?`),
    topOverall: db.prepare(`SELECT ${ENTRY_COLUMNS} ORDER BY s.score DESC, s.updated_at DESC LIMIT ?`),
    entryFor: db.prepare(`SELECT ${ENTRY_COLUMNS} WHERE s.player_id = ? AND s.category_id = ?`),
  };

  const recordAnswer = db.transaction((round, question, correct, now) => {
    if (sql.insertAnswer.run(round.id, question.id).changes === 0) return null;
    const seconds = (now - (round.last_answer_at ?? round.started_at)) / 1000;
    const points = correct ? pointsFor(question, seconds) : 0;
    sql.addPoints.run(points, now, round.id);
    return { points: Math.round(points), score: Math.round(round.score + points) };
  });

  const finishRound = db.transaction((round, playerId, now) => {
    sql.deleteRound.run(round.id);
    const score = Math.round(round.score);
    if (playerId && score > 0) sql.saveBest.run(playerId, round.category_id, score, new Date(now).toISOString());
    return score;
  });

  return {
    startRound(categoryId, now) {
      sql.deleteStaleRounds.run(now - ROUND_TTL_MS);
      const id = randomBytes(16).toString('base64url');
      sql.insertRound.run(id, categoryId, now);
      return id;
    },

    findRound(id, now) {
      return sql.findRound.get(id, now - ROUND_TTL_MS) ?? null;
    },

    recordAnswer,
    finishRound,

    findPlayer(token) {
      return sql.findPlayer.get(hashToken(token)) ?? null;
    },

    createPlayer(now) {
      const token = randomBytes(32).toString('base64url');
      for (let attempt = 1; ; attempt++) {
        const name = guestName();
        try {
          const { lastInsertRowid } = sql.insertPlayer.run(hashToken(token), name, new Date(now).toISOString());
          return { player: { id: Number(lastInsertRowid), name }, token };
        } catch (error) {
          if (error.code !== 'SQLITE_CONSTRAINT_UNIQUE' || attempt >= NAME_ATTEMPTS) throw error;
        }
      }
    },

    top(categoryId, limit) {
      return categoryId ? sql.topInCategory.all(categoryId, limit) : sql.topOverall.all(limit);
    },

    entryFor(playerId, categoryId) {
      return sql.entryFor.get(playerId, categoryId) ?? null;
    },
  };
}
