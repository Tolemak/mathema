import React from 'react';
import { Link } from 'react-router-dom';
import Topic from '../components/Topic';

const ProgressPage: React.FC = () => {
    return (
        <div className="page-container">
            <Topic>postępy</Topic>
            <p className="lead">
                Twoje najlepsze wyniki w każdym dziale są zapisane na tablicy wyników i podświetlone jak zakreślaczem.
            </p>
            <Link to="/leaderboard" className="button">Otwórz tablicę wyników</Link>
        </div>
    );
};

export default ProgressPage;
