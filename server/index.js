import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { openDatabase } from './db.js';
import { resolveTrustProxy } from './trustProxy.js';

const dataDir = process.env.DATA_DIR || fileURLToPath(new URL('./data', import.meta.url));
mkdirSync(dataDir, { recursive: true });

const db = openDatabase(path.join(dataDir, 'leaderboard.db'));
const app = createApp({ db, trustProxy: resolveTrustProxy(process.env.TRUST_PROXY) });

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '127.0.0.1';
const server = app.listen(port, host, () => console.log(`mathema-api listening on ${host}:${port}`));

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => server.close(() => {
    db.close();
    process.exit(0);
  }));
}
