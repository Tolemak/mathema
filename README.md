# Mathema

## Spis Treści
1. [Opis Projektu](#opis-projektu)
2. [Użyte Technologie](#użyte-technologie)
3. [Instrukcja Konfiguracji](#instrukcja-konfiguracji)
4. [Jak Korzystać](#jak-korzystać)
5. [Backend: API Tablicy Liderów](#backend-api-tablicy-liderów)
6. [Kolejne Kroki: Rozwój Backendu](#kolejne-kroki-rozwój-backendu)
    - [Główne Cele](#główne-cele)
    - [Planowany Stos Technologiczny](#planowany-stos-technologiczny)
    - [Wpływ na Frontend](#wpływ-na-frontend)
7. [Wkład w Projekt](#wkład-w-projekt)

## Opis Projektu
Mathema to interaktywna aplikacja internetowa stworzona, aby pomóc użytkownikom ćwiczyć i doskonalić umiejętności matematyczne. Aplikacja prezentuje użytkownikom różnorodne zadania matematyczne z różnych kategorii i pozwala im sprawdzać swoją wiedzę w trybie interaktywnym lub przeglądać zestawy zadań. Użytkownicy mogą również śledzić swoje postępy i przeglądać wyniki w globalnej tabeli liderów.

## Użyte Technologie
- **React**: Biblioteka JavaScript do budowania interfejsów użytkownika.
- **Vite**: Szybkie narzędzie do budowy i serwer deweloperski dla nowoczesnych projektów webowych.
- **TypeScript**: Nadzbiór JavaScriptu dodający statyczne typowanie, poprawiający jakość i łatwość utrzymania kodu.
- **React Router**: Do deklaratywnego routingu w aplikacji React.
- **React Icons**: Do dołączania popularnych ikon do projektu.
- **CSS**: Do stylizacji aplikacji, z naciskiem na globalne style i klasy wielokrotnego użytku.
- **Node.js / Express**: Backend API obsługujący wspólną tablicę liderów (`server/`).
- **better-sqlite3**: Trwałe przechowywanie wyników po stronie serwera.
- **Vitest / Supertest**: Testy API backendu.

## Instrukcja Konfiguracji
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twojanazwauzytkownika/math-learning-app.git
   ```
2. Przejdź do katalogu projektu:
   ```bash
   cd mathema
   ```
3. Zainstaluj zależności:
   ```bash
   npm install
   ```
4. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
5. Otwórz przeglądarkę i przejdź pod adres `http://localhost:3000` (lub port przypisany przez Vite), aby zobaczyć aplikację.

## Jak Korzystać
- Aplikacja uruchamia się na **Stronie Powitalnej**, prezentując funkcje takie jak Tryb Interaktywny, Tryb Przeglądania i Śledzenie Postępów, wraz z przykładowymi zadaniami.
- Kliknij **"Rozpocznij Naukę"** na karcie funkcji (np. Tryb Interaktywny) lub głównym przycisku akcji, aby przejść do **Obszaru Ćwiczeń**.
- W **Obszarze Ćwiczeń** wybierz kategorię matematyczną (np. Algebra, Geometria).
- Następnie wybierz tryb:
    - **'Tryb Interaktywny'**: Rozwiązuj zadania jedno po drugim i otrzymuj natychmiastową informację zwrotną. Twój wynik, czas i inne metryki są śledzone.
    - **'Przeglądaj Zadania'**: Przeglądaj pytania i odpowiedzi dla wybranej kategorii bez presji czasu.
- Wracaj do poprzednich sekcji lub strony głównej, używając linków **"Powrót..."**.
- Uzyskaj dostęp do **Globalnej Tablicy Liderów** ze strony Postępów lub bezpośrednio, jeśli dostępny jest link, aby zobaczyć najlepsze wyniki. Wyniki gości są wyróżnione.
- **Strona Postępów** obecnie zawiera link do tablicy liderów i jest planowana do przyszłych ulepszeń.

## Backend: API Tablicy Liderów
Katalog `server/` zawiera lekkie API (Node.js/Express + SQLite) obsługujące **prawdziwą, wspólną tablicę liderów** — wyniki są trwałe i widoczne dla wszystkich graczy, nie tylko lokalnie w przeglądarce.

- `GET /leaderboard?category=&limit=` — najlepsze wyniki (opcjonalnie filtrowane po kategorii).
- `GET /leaderboard/mine?clientId=&category=` — własny wynik gracza w danej kategorii (nawet spoza top wyników).
- `POST /leaderboard` — zapis/aktualizacja wyniku (walidacja liczb, throttling per IP).

Testy (`server/app.test.js`, Vitest + Supertest) pokrywają walidację, upsert, throttling i filtrowanie:
```bash
cd server
npm install
npm test
```

## Kolejne Kroki: Rozwój Backendu
Trwałość wyników i wspólna tablica liderów (punkty 2 i 3 poniżej) są już zrealizowane — patrz sekcja wyżej. Pozostała, większa faza rozwoju to pełne konta użytkowników.

### Główne Cele:
1.  **Uwierzytelnianie Użytkowników:** Implementacja systemu rejestracji i logowania użytkowników.
2.  ~~**Trwałe Dane Użytkownika**~~ ✅ Wyniki są już trwale przechowywane po stronie serwera.
3.  ~~**Współdzielona Tablica Liderów**~~ ✅ Zrealizowane — patrz [Backend: API Tablicy Liderów](#backend-api-tablicy-liderów).
4.  ~~**Rozwój API**~~ ✅ Zrealizowane (REST, patrz wyżej).
5.  **Zgłaszanie Zadań przez Użytkowników:** Umożliwienie zalogowanym użytkownikom zgłaszania własnych propozycji zadań do dodania do aplikacji (po weryfikacji).

### Planowany Stos Technologiczny (dla uwierzytelniania):
-   **Uwierzytelnianie:** (Do ustalenia - np. JWT, OAuth)

### Wpływ na Frontend:
-   Integracja z nowym API do zarządzania sesjami użytkowników.
-   Aktualizacje komponentów UI w celu odzwierciedlenia stanów uwierzytelnionych użytkowników.
-   Ulepszona obsługa błędów i stany ładowania dla interakcji z API.

## Wkład w Projekt
Zachęcamy do wkładu! Prosimy o przesyłanie pull requestów lub otwieranie zgłoszeń (issues) z wszelkimi sugestiami, poprawkami błędów lub ulepszeniami. Upewnij się, że nowy kod jest zgodny z istniejącą strukturą projektu i stylem kodowania.