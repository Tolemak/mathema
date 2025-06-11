# Mathema

## Overview
Mathema is an interactive web application designed to help users practice and improve their mathematics skills. The app presents users with various math questions from different categories and allows them to test their knowledge in an interactive mode or browse through sets of problems.

## Technologies Used
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server for modern web projects.
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
- **CSS**: For styling the application.

## Project Structure
```
mathema
├── src
│   ├── App.tsx                # Main application component, sets up routing
│   ├── main.tsx               # Entry point of the application
│   ├── components
│   │   ├── Question.tsx       # Component for displaying math questions
│   │   └── Scoreboard.tsx     # Component for displaying user scores
│   ├── pages
│   │   ├── WelcomePage.tsx   # Welcome page of the application (displays features, example tasks)
│   │   └── PracticeAreaPage.tsx # Page for interactive practice and browsing questions
│   └── styles
│       └── global.css         # Global styles for the application
├── index.html                 # Main HTML file
├── package.json               # NPM configuration file
├── tsconfig.json              # TypeScript configuration file
├── vite.config.ts             # Vite configuration file
└── README.md                  # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/math-learning-app.git
   ```
2. Navigate to the project directory:
   ```
   cd mathema
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173` to view the application. (Note: Vite's default port is often 5173, adjust if different)

## Usage
- The application opens on the Welcome Page, showcasing features and example tasks.
- Click "Rozpocznij Naukę" to navigate to the Practice Area.
- In the Practice Area, select a category and choose between 'Interactive' mode to solve problems or 'Browse tasks' mode to review questions and answers.
- Your score and performance metrics will be displayed on the scoreboard in interactive mode.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.