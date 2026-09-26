# Mathema

Math practice app: pick a category, solve problems against the clock or just browse them. React + TypeScript + Vite. The shared leaderboard runs on a small Express + SQLite API in `server/`, which scores rounds itself instead of trusting the browser. [mathema.tolemak.pl](https://mathema.tolemak.pl/)

[Polska wersja](README.pl.md)

```bash
npm install
npm run dev     # http://localhost:3000
npm test
npm run lint
```

API (the frontend calls it under `/api`, on the server via a reverse proxy):

```bash
cd server
npm install
npm start                 # port 3000, or PORT
npm run test:coverage
docker compose up -d      # 127.0.0.1:40056
```
