import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaChartLine, FaBookOpen } from 'react-icons/fa';
import { categories } from '../data/mathProblems';
import FeatureCard from '../components/FeatureCard'; 
import TaskCard from '../components/TaskCard'; 
import '../styles/global.css';

const WelcomePage: React.FC = () => {
  const allQuestions = categories.flatMap(category => category.questions);
  const exampleTasks = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1>Witaj w Mathema!</h1>
        <p>
          Twoje centrum nauki matematyki. Odkrywaj, ćwicz i śledź swoje postępy.
        </p>
      </header>

      <section className="features-grid">
        <FeatureCard
          icon={<FaPencilAlt size={45} className="icon-interactive" />}
          title="Interaktywne Rozwiązywanie Zadań"
          description="Zmierz się z losowymi zadaniami, zdobywaj punkty i pnij się w rankingu. Idealne do sprawdzania wiedzy."
          linkTo="/practice?mode=interactive"
          linkLabel="Rozpocznij Ćwiczenia"
          buttonClassName="interactive-button"
        />
        <FeatureCard
          icon={<FaBookOpen size={45} className="icon-browse" />}
          title="Przeglądanie Zestawów Zadań"
          description="Przeglądaj zadania według kategorii, poziomu trudności i szkoły. Ucz się we własnym tempie."
          linkTo="/practice?mode=browse"
          linkLabel="Przeglądaj Zadania"
          buttonClassName="browse-button"
        />
        <FeatureCard
          icon={<FaChartLine size={45} className="icon-progress" />}
          title="Śledzenie Postępów"
          description="Monitoruj swoje wyniki, sprawdzaj rankingi i obserwuj, jak stajesz się coraz lepszy."
          linkTo="/progress"
          linkLabel="Zobacz Postępy"
          buttonClassName="progress-button"
        />
      </section>

      <section className="example-tasks-section">
        <h2 className="example-tasks-header">Przykładowe Zadania</h2>
        <div className="tasks-grid">
          {exampleTasks.map((task) => (
            <TaskCard
              key={task.id}
              text={task.text}
              schoolLevel={task.schoolLevel}
              difficulty={task.difficulty}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;