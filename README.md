# Mathema

## Opis Projektu
Mathema to interaktywna aplikacja internetowa stworzona, aby pomóc użytkownikom ćwiczyć i doskonalić umiejętności matematyczne. Aplikacja prezentuje użytkownikom różnorodne zadania matematyczne z różnych kategorii i pozwala im sprawdzać swoją wiedzę w trybie interaktywnym lub przeglądać zestawy zadań. Użytkownicy mogą również śledzić swoje postępy i przeglądać wyniki w globalnej tabeli liderów.

## Użyte Technologie
- **React**: Biblioteka JavaScript do budowania interfejsów użytkownika.
- **Vite**: Szybkie narzędzie do budowy i serwer deweloperski dla nowoczesnych projektów webowych.
- **TypeScript**: Nadzbiór JavaScriptu dodający statyczne typowanie, poprawiający jakość i łatwość utrzymania kodu.
- **React Router**: Do deklaratywnego routingu w aplikacji React.
- **React Icons**: Do dołączania popularnych ikon do projektu.
- **CSS**: Do stylizacji aplikacji, z naciskiem na globalne style i klasy wielokrotnego użytku.

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
5. Otwórz przeglądarkę i przejdź pod adres `http://localhost:5173` (lub port przypisany przez Vite), aby zobaczyć aplikację.

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

## Kolejne Kroki: Rozwój Backendu
Następna główna faza rozwoju Mathema obejmuje stworzenie systemu backendowego w celu wsparcia bardziej zaawansowanych funkcji i trwałości danych.

### Główne Cele:
1.  **Uwierzytelnianie Użytkowników:** Implementacja systemu rejestracji i logowania użytkowników.
2.  **Trwałe Dane Użytkownika:** Przechowywanie postępów użytkownika, wyników i preferencji w bazie danych.
3.  **Współdzielona Tablica Liderów:** Przeniesienie danych tablicy liderów do centralnej bazy danych, umożliwiając stworzenie prawdziwie globalnego i trwałego systemu rankingowego.
4.  **Rozwój API:** Stworzenie API RESTful lub GraphQL do obsługi komunikacji między frontendem a backendem.
5.  **Zgłaszanie Zadań przez Użytkowników:** Umożliwienie zalogowanym użytkownikom zgłaszania własnych propozycji zadań do dodania do aplikacji (po weryfikacji).

### Planowany Stos Technologiczny:
-   **Framework Backendowy:** (Do ustalenia - np. Node.js z Express, Python z Django/Flask lub inna odpowiednia technologia)
-   **Baza Danych:** **PostgreSQL**, hostowana na współdzielonej platformie, takiej jak [mikr.us](https://mikr.us) lub podobnej usłudze. Umożliwi to solidne przechowywanie danych i możliwości zapytań.
-   **Uwierzytelnianie:** (Do ustalenia - np. JWT, OAuth)

### Wpływ na Frontend:
-   Integracja z nowym API do pobierania danych, przesyłania wyników i zarządzania sesjami użytkowników.
-   Aktualizacje komponentów UI w celu odzwierciedlenia stanów uwierzytelnionych użytkowników i wyświetlania trwałych danych.
-   Ulepszona obsługa błędów i stany ładowania dla interakcji z API.

## Wkład w Projekt
Zachęcamy do wkładu! Prosimy o przesyłanie pull requestów lub otwieranie zgłoszeń (issues) z wszelkimi sugestiami, poprawkami błędów lub ulepszeniami. Upewnij się, że nowy kod jest zgodny z istniejącą strukturą projektu i stylem kodowania.