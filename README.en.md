# Mathema

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies](#technologies)
3. [Setup](#setup)
4. [Usage](#usage)
5. [Backend: Leaderboard API](#backend-leaderboard-api)
6. [Next Steps: Backend Development](#next-steps-backend-development)
    - [Main Goals](#main-goals)
    - [Planned Tech Stack](#planned-tech-stack)
    - [Frontend Impact](#frontend-impact)
7. [Contributing](#contributing)

## Project Overview
Mathema is an interactive web application that helps users practice and improve their math skills. It presents math problems across several categories, in both an interactive quiz mode and a free-browsing mode. Users can track their progress and check their scores on a global leaderboard.

## Technologies
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and dev server for modern web projects.
- **TypeScript**: Adds static typing on top of JavaScript.
- **React Router**: Declarative routing for React apps.
- **React Icons**: Popular icon sets for the project.
- **CSS**: Global styles and reusable classes.
- **Node.js / Express**: Backend API powering the shared leaderboard (`server/`).
- **better-sqlite3**: Persistent server-side score storage.
- **Vitest / Supertest**: Backend API tests.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/math-learning-app.git
   ```
2. Enter the project directory:
   ```bash
   cd mathema
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000` (or the port Vite assigns) to see the app.

## Usage
- The app opens on the **Welcome Page**, showcasing features like Interactive Mode, Browse Mode and Progress Tracking, along with sample tasks.
- Click **"Start Learning"** on a feature card (e.g. Interactive Mode) or the main call-to-action button to go to the **Practice Area**.
- In the **Practice Area**, pick a math category (e.g. Algebra, Geometry).
- Then choose a mode:
    - **'Interactive Mode'**: Solve problems one by one with instant feedback. Your score, time and other metrics are tracked.
    - **'Browse Mode'**: Browse questions and answers for the chosen category without time pressure.
- Use the **"Back..."** links to return to previous sections or the home page.
- Access the **Global Leaderboard** from the Progress page, or directly if a link is available, to see top scores. Guest scores are highlighted.
- The **Progress Page** currently links to the leaderboard and is planned for future improvements.

## Backend: Leaderboard API
The `server/` directory contains a lightweight API (Node.js/Express + SQLite) powering a **real, shared leaderboard** — scores are persisted and visible to all players, not just stored locally in the browser.

- `GET /leaderboard?category=&limit=` — top scores (optionally filtered by category).
- `GET /leaderboard/mine?clientId=&category=` — a player's own score in a given category (even outside the top results).
- `POST /leaderboard` — save/update a score (numeric validation, per-IP throttling).

Tests (`server/app.test.js`, Vitest + Supertest) cover validation, upsert, throttling and filtering:
```bash
cd server
npm install
npm test
```

## Next Steps: Backend Development
Score persistence and the shared leaderboard (items 2 and 3 below) are already in place — see the section above. The remaining, larger phase of work is full user accounts.

### Main Goals:
1.  **User Authentication:** Implement user registration and login.
2.  ~~**Persistent User Data**~~ Done — scores are already persisted server-side.
3.  ~~**Shared Leaderboard**~~ Done — see [Backend: Leaderboard API](#backend-leaderboard-api).
4.  ~~**API Development**~~ Done (REST, see above).
5.  **User-Submitted Problems:** Let logged-in users submit their own problem suggestions to be added to the app (after review).

### Planned Tech Stack (for authentication):
-   **Auth:** (TBD — e.g. JWT, OAuth)

### Frontend Impact:
-   Integration with the new API for session management.
-   UI updates to reflect authenticated user states.
-   Better error handling and loading states for API interactions.

## Contributing
Contributions are welcome! Please submit pull requests or open issues with suggestions, bug fixes or improvements. Make sure new code follows the existing project structure and coding style.
