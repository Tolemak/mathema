# Mathema

Math practice app: pick a category, solve problems against the clock or just browse them. React + TypeScript + Vite. The shared leaderboard runs on a small Express + SQLite API in `server/`, which scores rounds itself instead of trusting the browser. [mathema.tolemak.pl](https://mathema.tolemak.pl/)

[Polska wersja](README.pl.md)

The interface is available in Polish (default) and English. The PL/EN switch in the bottom bar changes the language, the choice is remembered in the browser and sets `<html lang>`. Problem statements stay in Polish; section names, levels, difficulty and all interface text are translated.

```bash
npm install
npm run dev     # http://localhost:3000
npm test
npm run lint
```

The `.htaccess` in `public/` serves `index.html` for every route that is not a file; paths under `/assets/` and paths with a file extension that do not exist return a real 404 instead of the SPA shell, and it also blocks `.git`, `.env` and `.htaccess` themselves and disables directory listings.

API (the frontend calls it under `/api`, on the server via a reverse proxy):

```bash
cd server
npm install
npm start                 # port 3000, or PORT
npm run test:coverage
docker compose up -d      # 127.0.0.1:40056
```
