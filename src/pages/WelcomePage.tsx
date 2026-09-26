import React from 'react';
import { Link } from 'react-router-dom';
import DailyTask from '../components/DailyTask';
import Topic from '../components/Topic';

const WelcomePage: React.FC = () => {
  return (
    <div className="page-container welcome">
      <Topic>zadanie na dziś</Topic>
      <p className="lead">Zadania z matematyki od czwartej klasy podstawówki do pierwszego roku studiów technicznych. Rozwiąż to poniżej albo wybierz dział.</p>

      <DailyTask />

      <section className="next-steps" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title">Co dalej</h2>
        <ul className="contents">
          <li>
            <Link to="/practice?mode=interactive">Ćwicz na punkty</Link>
            <span>Seria losowych zadań z jednego działu. Liczy się poprawność i czas, a wynik trafia na tablicę.</span>
          </li>
          <li>
            <Link to="/practice?mode=browse">Przeglądaj zadania</Link>
            <span>Wszystkie zadania z odpowiedziami, z filtrem poziomu i trudności.</span>
          </li>
          <li>
            <Link to="/leaderboard">Tablica wyników</Link>
            <span>Najlepsze wyniki graczy ze wszystkich działów.</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default WelcomePage;
