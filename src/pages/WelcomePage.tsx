import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaChartLine, FaBookOpen } from 'react-icons/fa';
import { categories } from '../data/mathProblems'; 
import '../styles/global.css';

const WelcomePage: React.FC = () => {
  
  const allQuestions = categories.flatMap(category => category.questions);
  const exampleTasks = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="welcome-container">
      <header className="welcome-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5em', color: '#2c3e50', fontWeight: 'bold' }}>Witaj w Mathema!</h1>
        <p style={{ fontSize: '1.4em', color: '#34495e', marginTop: '10px' }}>
          Twoje centrum nauki matematyki. Odkrywaj, ćwicz i śledź swoje postępy.
        </p>
      </header>

      <section className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        
        <div className="feature-card" style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <FaPencilAlt size={45} color="#3498db" style={{ marginBottom: '15px' }} />
          <h3 style={{ fontSize: '1.6em', color: '#2c3e50', marginBottom: '10px' }}>Interaktywne Rozwiązywanie Zadań</h3>
          <p style={{ fontSize: '1em', color: '#555', lineHeight: '1.6' }}>
            Zmierz się z losowymi zadaniami, zdobywaj punkty i pnij się w rankingu. Idealne do sprawdzania wiedzy.
          </p>
          <Link to="/practice?mode=interactive" className="feature-link" style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            Rozpocznij Ćwiczenia
          </Link>
        </div>

        
        <div className="feature-card" style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          <FaBookOpen size={45} color="#e67e22" style={{ marginBottom: '15px' }} />
          <h3 style={{ fontSize: '1.6em', color: '#2c3e50', marginBottom: '10px' }}>Przeglądanie Zestawów Zadań</h3>
          <p style={{ fontSize: '1em', color: '#555', lineHeight: '1.6' }}>
            Przeglądaj zadania według kategorii, poziomu trudności i szkoły. Ucz się we własnym tempie.
          </p>
          <Link to="/practice?mode=browse" className="feature-link" style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#e67e22', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            Przeglądaj Zadania
          </Link>
        </div>

        
        <div className="feature-card" style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          <FaChartLine size={45} color="#2ecc71" style={{ marginBottom: '15px' }} />
          <h3 style={{ fontSize: '1.6em', color: '#2c3e50', marginBottom: '10px' }}>Śledzenie Postępów</h3>
          <p style={{ fontSize: '1em', color: '#555', lineHeight: '1.6' }}>
            Monitoruj swoje wyniki, sprawdzaj rankingi i obserwuj, jak stajesz się coraz lepszy.
          </p>
          <Link to="/progress" className="feature-link" style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            Zobacz Postępy
          </Link>
        </div>
      </section>

      <section className="example-tasks" style={{ marginBottom: '50px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '2em' }}>Przykładowe Zadania</h2>
        <div className="tasks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {exampleTasks.map((task) => (
            <div key={task.id} className="task-card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }}>
              
              <p style={{ fontSize: '1.1em', color: '#333', marginBottom: '10px' }}><strong>Zadanie:</strong> {task.text}</p>
              <p style={{ fontSize: '0.9em', color: '#555' }}>Poziom: {task.schoolLevel}, Trudność: {task.difficulty}</p>
              
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;