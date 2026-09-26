# Mathema

Aplikacja do ćwiczenia matematyki: wybierasz kategorię, rozwiązujesz zadania na czas albo po prostu je przeglądasz. React + TypeScript + Vite. Wspólny ranking działa na małym API w Express + SQLite w `server/`, które samo liczy punkty rundy zamiast ufać przeglądarce. [mathema.tolemak.pl](https://mathema.tolemak.pl/)

[English version](README.md)

```bash
npm install
npm run dev     # http://localhost:3000
npm test
npm run lint
```

API (frontend woła je pod `/api`, na serwerze przez reverse proxy):

```bash
cd server
npm install
npm start                 # port 3000 albo PORT
npm run test:coverage
docker compose up -d      # 127.0.0.1:40056
```
