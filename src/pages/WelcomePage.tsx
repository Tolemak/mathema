import React from 'react';
import { Link } from 'react-router-dom';
import { problems as mathProblems, Question } from '../data/mathProblems'; // Poprawiony import i dodany typ Question
// import '../styles/WelcomePage.css'; // Jeśli masz specyficzne style dla tej strony

const WelcomePage: React.FC = () => {
    // Wybierz kilka przykładowych zadań do wyświetlenia
    const exampleTasks: Question[] = mathProblems.slice(0, 3); // Dodano typ dla exampleTasks

    return (
        <div className="page-container"> {/* Użycie nowej klasy page-container */}
            <h1>Witaj w Mathema!</h1>
            <p className="lead" style={{ textAlign: 'center' }}>Twoje centrum nauki matematyki.</p> {/* Wyśrodkowany tekst */}

            <div className="content-wrapper"> {/* Dodatkowy wrapper dla treści, jeśli potrzebne */}
                <section className="features-overview" style={{ textAlign: 'center', marginBottom: '30px' }}> {/* Wyśrodkowana sekcja */}
                    <h2>Co oferujemy?</h2>
                    <p>Mathema to platforma zaprojektowana, aby pomóc Ci opanować matematykę poprzez:</p>
                    <ul style={{ listStylePosition: 'inside', paddingLeft: '0', textAlign: 'center' }}> {/* Wyśrodkowana lista */}
                        <li>Interaktywne rozwiązywanie zadań z natychmiastową informacją zwrotną.</li>
                        <li>Możliwość przeglądania setek zadań z różnych kategorii i poziomów trudności. <Link to="/practice" className="nav-button-link">Przeglądaj kategorie</Link></li>
                        <li>Śledzenie postępów i wyników w trybie interaktywnym.</li>
                        <li>Dostęp do szerokiej gamy kategorii tematycznych. <Link to="/practice" className="nav-button-link">Zobacz kategorie</Link></li>
                    </ul>
                </section>

                <section className="example-tasks" style={{ textAlign: 'center' }}> {/* Wyśrodkowana sekcja */}
                    <h2>Przykładowe zadania</h2>
                    <div className="tasks-grid" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}> {/* Wyśrodkowane karty zadań */}
                        {exampleTasks.map((task: Question) => ( // Dodano typ dla task
                            <div key={task.id} className="task-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '300px', textAlign: 'left' }}>
                                <h3>{task.category}</h3>
                                <p><strong>Poziom:</strong> {task.schoolLevel}</p>
                                <p><strong>Trudność:</strong> {task.difficulty}</p>
                                <p>{task.questionText}</p>
                                {/* Możesz dodać przycisk prowadzący do zadania lub kategorii */}
                            </div>
                        ))}
                    </div>
                    <Link to="/practice" className="nav-button-link" style={{ marginTop: '20px' }}>
                        Rozpocznij naukę
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default WelcomePage;