# Mathema

Aplikacja do ćwiczenia matematyki: wybierasz kategorię, rozwiązujesz zadania na czas albo po prostu je przeglądasz. React + TypeScript + Vite. Wspólny ranking działa na małym API w Express + SQLite w `server/`, które samo liczy punkty rundy zamiast ufać przeglądarce. [mathema.tolemak.pl](https://mathema.tolemak.pl/)

[English version](README.md)

```bash
npm install
npm run dev     # http://localhost:3000
npm test
npm run lint
```

`.htaccess` w `public/` serwuje `index.html` dla każdej ścieżki, która nie jest plikiem; nieistniejące ścieżki pod `/assets/` i z rozszerzeniem pliku zwracają prawdziwe 404 zamiast powłoki SPA, a plik blokuje też `.git`, `.env` i sam `.htaccess` oraz wyłącza listowanie katalogów.

Uwagi:

- `src/utils/answerCheck.ts` ocenia odpowiedzi tekstowe łagodnie: różnice w białych znakach, wielkości liter, jednostkach i drobne literówki w słowach są wybaczane, ale każda cyfra musi pasować dokładnie (łagodnie co do zapisu „100 zł”, nigdy co do tego, czy liczba to 100). Każda liczba poprawnej odpowiedzi musi wystąpić w danych, w tej kolejności i dokładnie; gdy się zgadzają, reszta (kształt nienumeryczny) jest porównywana z tolerancją Levenshteina. Wpisanie samych liczb jest zawsze akceptowane, np. „100” dla „100 zł”. Odpowiedzi liczbowe porównują się dokładnie i przyjmują polskie przecinki dziesiętne („3,5”).
- Końcowe „(wyjaśnienie)” w zapisanej odpowiedzi, np. „100 zł (108 / 1.08)”, nie jest do wpisania i jest obcinane. Nawiasy zostają, gdy są treścią: argument relacji („x ∈ (-2, 2)”), operatora („n*x^(n-1)”) lub wywołania funkcji („sin(x)”, „6 * sqrt(2)”), rozpoznawane po braku białego znaku przed „(”.
- W `PracticeAreaPage` tryb żyje w adresie URL, ale można go przełączać przyciskami, więc jest synchronizowany ponownie przy nawigacji w trakcie renderowania, a nie odbijany z efektu.
- `src/tolemak-bar/tolemak-bar.js` to pasek statusu wspólny dla wszystkich aplikacji Tolemak: `<tolemak-bar>` z dziećmi `<tolemak-field>`, zwykłe elementy custom bez zależności, więc ten sam plik działa w Reakcie, Twigu i statycznych stronach. Kolory pochodzą ze strony hosta przez własne właściwości `--tb-*`. Używa konstruowanych arkuszy stylów zamiast tagów `<style>`, żeby działał przy restrykcyjnym CSP `style-src`. `langList()` jest metodą, a nie getterem, bo React 19 przypisuje atrybuty jako właściwości, gdy element ma taką o tej nazwie. Pasek tylko ogłasza wybór motywu i języka jako zdarzenia; aplikacja z własnym stanem motywu anuluje zdarzenie `tolemak-theme` i sama stosuje motyw (`ThemeProvider` trzyma wybór i animuje przełączenie), a język wymaga tłumaczeń aplikacji. Przy wyłączonym storage wybór motywu trwa do przeładowania. Strony wstawiają własne bieżące wartości do paska przez `useBarFields`; wartości domyślne wracają po odmontowaniu.
- UI: `DailyTask` to jedno losowe zadanie do rozwiązania od razu, sprawdzane na miejscu, a punkty liczą się tylko w trybie interaktywnym; `MarkedAnswer` pokazuje odpowiedź tak, jak ocenia ją nauczyciel (zakreślona z ptaszkiem, gdy dobra, przekreślona z poprawnym wynikiem, gdy zła); `Topic` zapisuje tytuły stron tak, jak zaczyna się lekcja w polskim zeszycie.

API (frontend woła je pod `/api`, na serwerze przez reverse proxy):

```bash
cd server
npm install
npm start                 # port 3000 albo PORT
npm run test:coverage
docker compose up -d      # 127.0.0.1:40056
```
