import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaArrowCircleLeft } from 'react-icons/fa';

const ProgressPage: React.FC = () => {
    return (
        <div className="page-container">
            <h1>Śledzenie Postępów</h1>
            <p className="text-center-style">
                Tutaj możesz znaleźć narzędzia i raporty dotyczące Twoich postępów w nauce matematyki.
            </p>
            <div className="centered-flex-column-container">
                <Link to="/leaderboard" className="button primary large-button">
                    <FaTrophy className="button-icon" />
                    Globalna Tablica Wyników
                </Link>
            </div>
            <div className="back-link-container" style={{ marginTop: '30px' }}>
                <Link to="/" className="nav-button-link secondary">
                    <FaArrowCircleLeft className="nav-button-icon" />
                    Powrót do strony głównej
                </Link>
            </div>
        </div>
    );
};

export default ProgressPage;
