import Database from 'better-sqlite3';

const SCHEMA_VERSION = 2;

export function openDatabase(path) {
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  if (db.pragma('user_version', { simple: true }) < SCHEMA_VERSION) migrate(db);
  return db;
}

function migrate(db) {
  db.transaction(() => {
    const legacy = db.prepare(`SELECT 1 FROM pragma_table_info('scores') WHERE name = 'client_id'`).get();
    if (legacy) db.exec('ALTER TABLE scores RENAME TO scores_legacy');

    db.exec(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY,
        token_hash TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rounds (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        last_answer_at INTEGER,
        score REAL NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS rounds_started_at ON rounds (started_at);

      CREATE TABLE IF NOT EXISTS round_answers (
        round_id TEXT NOT NULL REFERENCES rounds (id) ON DELETE CASCADE,
        question_id TEXT NOT NULL,
        PRIMARY KEY (round_id, question_id)
      );

      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY,
        player_id INTEGER NOT NULL REFERENCES players (id) ON DELETE CASCADE,
        category_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE (player_id, category_id)
      );
      CREATE INDEX IF NOT EXISTS scores_ranking ON scores (category_id, score DESC);
    `);

    db.pragma(`user_version = ${SCHEMA_VERSION}`);
  })();
}
