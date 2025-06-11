import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/mathProblems'; // Importuj kategorie i interfejsy

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
                        <Link to="/practice" className="feature-link">Przejdź do zadań interaktywnych</Link>
                    </div>
                    <div className="feature-item">
                        <h3>Przeglądaj Zbiory Zadań</h3>
                        <p>Dostęp do szerokiej gamy zadań z różnych działów matematyki.</p>
                        <Link to="/practice" className="feature-link">Przeglądaj zadania</Link>
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