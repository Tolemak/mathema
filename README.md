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

Notes:

- `src/utils/answerCheck.ts` grades free-text answers leniently: whitespace, case, unit differences and small typos in the wording are forgiven, but every digit must still match exactly (forgiving about how "100 zł" is written, never about whether the number is 100). Every number of the correct answer must appear in the input, in order and exactly; once they match, the remaining non-numeric shape is compared with a Levenshtein tolerance. Typing only the number(s) is always accepted, e.g. "100" for "100 zł". Numeric answers compare exactly and accept Polish comma-decimals ("3,5").
- A trailing "(explanation)" in a stored answer, e.g. "100 zł (108 / 1.08)", is not meant to be typed and is stripped. The parentheses stay when they are the payload: the argument of a relation ("x ∈ (-2, 2)"), of an operator ("n*x^(n-1)") or of a function call ("sin(x)", "6 * sqrt(2)"), recognised by no whitespace before "(".
- On `PracticeAreaPage` the mode lives in the URL but stays switchable by the buttons, so it is re-synced on navigation during render rather than mirrored from an effect.
- `src/tolemak-bar/tolemak-bar.js` is the status bar shared by all Tolemak apps: `<tolemak-bar>` with `<tolemak-field>` children, plain custom elements without dependencies, so the same file works in React, Twig and static pages. Colors come from the host page through `--tb-*` custom properties. It uses constructed stylesheets instead of `<style>` tags so it works under a strict `style-src` CSP. `langList()` is a method, not a getter, because React 19 assigns attributes as properties when the element has one of that name. The bar only announces the theme and language choices as events; an app with its own theme state cancels the `tolemak-theme` event and applies the theme itself (`ThemeProvider` keeps the choice and animates the switch), and language needs the app's own translations. If storage is disabled, the theme choice lasts until reload. Pages put their own live values into the bar with `useBarFields`; the defaults come back on unmount.
- UI: `DailyTask` is one random task to try straight away, checked on the spot, and points are counted only in the interactive mode; `MarkedAnswer` shows an answer as a teacher marks it (circled with a tick when right, crossed out with the correct result when wrong); `Topic` writes page titles the way a lesson starts in a Polish school notebook.

API (the frontend calls it under `/api`, on the server via a reverse proxy):

```bash
cd server
npm install
npm start                 # port 3000, or PORT
npm run test:coverage
docker compose up -d      # 127.0.0.1:40056
```

After the checks pass on `main`, CI publishes the built frontend as `ghcr.io/tolemak/mathema-static:<commit sha>` (a `FROM scratch` image with the files in `/site`) and the API image `ghcr.io/tolemak/mathema-api:<commit sha>` (both also `:latest`), each with a signed build provenance attestation. The server pulls and verifies both by itself; CI never connects to it.
