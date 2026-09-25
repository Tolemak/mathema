import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';
import { openDatabase } from './db.js';
import { categories, findCategory } from './questionBank.js';
import { DIFFICULTY_MULTIPLIERS, pointsFor, SCHOOL_LEVEL_MULTIPLIERS } from './scoring.js';
import { CLOUDFLARE_RANGES, DEFAULT_TRUST_PROXY, resolveTrustProxy } from './trustProxy.js';

describe('pointsFor', () => {
  const question = { difficulty: 'trudne', schoolLevel: 'liceum_rozsz' };

  it('doubles the base for an instant answer and gives the base at 30 s', () => {
    expect(pointsFor(question, 0)).toBe(80);
    expect(pointsFor(question, 30)).toBe(40);
  });

  it('penalises slow answers down to a floor', () => {
    expect(pointsFor(question, 60)).toBe(20);
    expect(pointsFor(question, 600)).toBe(8);
  });

  it('treats negative durations as instant', () => {
    expect(pointsFor(question, -5)).toBe(80);
  });
});

describe('question bank', () => {
  const questions = categories.flatMap((category) => category.questions);

  it('has unique category and question ids', () => {
    expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it('only uses known difficulties and school levels', () => {
    for (const question of questions) {
      expect(DIFFICULTY_MULTIPLIERS).toHaveProperty(question.difficulty);
      expect(SCHOOL_LEVEL_MULTIPLIERS).toHaveProperty(question.schoolLevel);
      expect(question.text).toBeTruthy();
      expect(['string', 'number']).toContain(typeof question.answer);
    }
  });

  it('looks categories up by id only', () => {
    expect(findCategory('algebra').questionsById.get('alg1').answer).toBe(3);
    expect(findCategory('Algebra')).toBeNull();
    expect(findCategory(['algebra'])).toBeNull();
    expect(findCategory(undefined)).toBeNull();
  });
});

describe('resolveTrustProxy', () => {
  it('trusts local hops and Cloudflare by default', () => {
    expect(resolveTrustProxy(undefined)).toBe(DEFAULT_TRUST_PROXY);
    expect(DEFAULT_TRUST_PROXY).toEqual(expect.arrayContaining(['loopback', 'uniquelocal', ...CLOUDFLARE_RANGES]));
  });

  it('accepts a hop count or a list', () => {
    expect(resolveTrustProxy('2')).toBe(2);
    expect(resolveTrustProxy('loopback, 192.0.2.0/24,')).toEqual(['loopback', '192.0.2.0/24']);
  });
});

describe('openDatabase', () => {
  let dir;

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it('archives the legacy client-keyed scores table', () => {
    dir = mkdtempSync(path.join(tmpdir(), 'mathema-'));
    const file = path.join(dir, 'leaderboard.db');

    const legacy = new Database(file);
    legacy.exec(`
      CREATE TABLE scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT, client_id TEXT NOT NULL, category_name TEXT NOT NULL,
        player_name TEXT NOT NULL, score REAL NOT NULL, difficulty TEXT, school_level TEXT,
        updated_at TEXT NOT NULL, UNIQUE(client_id, category_name)
      );
      INSERT INTO scores (client_id, category_name, player_name, score, updated_at)
      VALUES ('guest_1', 'Algebra', 'Gość 123456', 99999, '2026-01-01T00:00:00.000Z');
    `);
    legacy.close();

    const db = openDatabase(file);
    expect(db.pragma('user_version', { simple: true })).toBe(2);
    expect(db.prepare('SELECT player_name FROM scores_legacy').all()).toEqual([{ player_name: 'Gość 123456' }]);
    expect(db.prepare('SELECT COUNT(*) AS n FROM scores').get()).toEqual({ n: 0 });
    db.close();

    const reopened = openDatabase(file);
    expect(reopened.prepare('SELECT COUNT(*) AS n FROM scores_legacy').get()).toEqual({ n: 1 });
    reopened.close();
  });
});
