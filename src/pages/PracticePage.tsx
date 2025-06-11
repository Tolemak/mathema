import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

// Keep categories here to showcase some examples, or move to a shared data file later
const categories = [
    { id: 'algebra', name: 'Algebra', questions: [
        { id: 'alg1', text: "Rozwiąż równanie: 2x + 5 = 11", answer: 3 },
        { id: 'alg2', text: "Uprość wyrażenie: (a+b)^2 - (a-b)^2", answer: "4ab" }
    ]},
    { id: 'geometry', name: 'Geometria', questions: [
        { id: 'geo1', text: "Oblicz pole trójkąta o podstawie 10 i wysokości 5.", answer: 25 },
        { id: 'geo2', text: "Jaka jest suma kątów wewnętrznych w pięciokącie?", answer: 540 }
    ]},
    { id: 'functions', name: 'Funkcje', questions: [
        { id: 'fun1', text: "Dla f(x) = 3x - 7, oblicz f(4).", answer: 5 },
        { id: 'fun2', text: "Jaki jest zbiór wartości funkcji y = x^2?", answer: "[0, +∞)" }
    ]}
];

// Select a few example/featured tasks to display
const featuredTasks = [
    categories[0].questions[0], // First algebra question
    categories[1].questions[0], // First geometry question
    categories[2].questions[0], // First functions question
];

const WelcomePage: React.FC = () => { // Renamed component for clarity, was PracticePage
    return (
        <div className="welcome-page-container">
            <header className="welcome-header">
                <h1>Witaj w Mathema!</h1>
                <p>Twoje centrum nauki matematyki – od podstaw po zaawansowane zagadnienia.</p>
            </header>

            <section className="features-overview">
                <h2>Co oferujemy?</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>Interaktywne Zadania</h3>
                        <p>Sprawdź swoją wiedzę rozwiązując zadania w trybie interaktywnym.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Przeglądaj Zbiory Zadań</h3>
                        <p>Dostęp do szerokiej gamy zadań z różnych działów matematyki.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Różnorodne Kategorie</h3>
                        <p>Algebra, geometria, funkcje i wiele więcej – wszystko w jednym miejscu.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Śledzenie Postępów (Wkrótce!)</h3>
                        <p>Monitoruj swoje postępy i zdobywaj nowe umiejętności.</p>
                    </div>
                </div>
            </section>

            <section className="featured-tasks-section">
                <h2>Przykładowe Zadania</h2>
                <div className="tasks-grid">
                    {featuredTasks.map((task, index) => (
                        <div key={task.id || index} className="task-card">
                            <h4>{categories.find(cat => cat.questions.some(q => q.id === task.id))?.name || 'Matematyka'}</h4>
                            <p>{task.text}</p>
                            {/* Można dodać przycisk "Zobacz odpowiedź" lub "Rozwiąż" w przyszłości */}
                        </div>
                    ))}
                </div>
            </section>

            <section className="call-to-action">
                <h2>Gotowy na wyzwanie?</h2>
                <Link to="/practice" className="cta-button">
                    Rozpocznij Naukę
                </Link>
            </section>

            <footer className="welcome-footer">
                <p>&copy; {new Date().getFullYear()} Mathema Learning App</p>
            </footer>
        </div>
    );
};

export default WelcomePage; // Exporting the renamed component