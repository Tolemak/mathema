import React from 'react';
import { Link } from 'react-router-dom';

const ProgressPage: React.FC = () => {
    return (
        <div className="page-container">
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Śledzenie Postępów</h1>
            <p style={{ textAlign: 'center', marginBottom: '40px' }}>
                Tutaj możesz znaleźć narzędzia i raporty dotyczące Twoich postępów w nauce matematyki.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <Link to="/leaderboard" className="button primary" style={{ minWidth: '250px', padding: '15px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trophy-fill" viewBox="0 0 16 16" style={{ marginRight: '10px'}}>
                        <path d="M2.5.5A.5.5 0 0 1 3 .5V1h4v1H3a1 1 0 0 0-1 1v3c0 .535.124 1.034.352 1.464.128.24.304.458.513.642l1.5 1.5H12l1.5-1.5c.209-.184.385-.402.513-.642C14.376 6.034 14.5 5.535 14.5 5V3a1 1 0 0 0-1-1H9V1h4v-.5a.5.5 0 0 1 1 0V1A2 2 0 0 1 12 3v2h-1.062c-.083-.49-.246-.928-.468-1.284C10.264 3.336 10.01 3 9.5 3H6.5c-.51 0-.764.336-.97.716-.222.356-.385.794-.468 1.284H4V3a2 2 0 0 1-2-2V.5A.5.5 0 0 1 2.5.5zM0 11.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm.096-4.084c.08.192.202.37.348.528C1.176 8.68 1.825 9 2.5 9h1V8h-1c-.361 0-.626-.11-.796-.252-.17-.142-.288-.313-.35-.488A2.5 2.5 0 0 1 1.5 6c0-.568.106-1.086.288-1.544.182-.458.456-.834.78-1.11C2.894 3.07 3.45 3 4 3h8c.55 0 1.106.07 1.432.346.324.276.598.652.78 1.11C14.394 4.914 14.5 5.432 14.5 6c0 .63-.06 1.19-.17 1.692-.062.175-.18.346-.35.488-.17.142-.435.252-.796.252H12V9h1c.675 0 1.324-.32 2.056-.988.146-.158.268-.336.348-.528A3.5 3.5 0 0 0 16 6c0-.99-.246-1.882-.638-2.59C14.974 2.71 14.298 2 13.5 2h-11C1.702 2 .926 2.71.538 3.41A3.5 3.5 0 0 0 0 6c0 .58.087 1.124.23 1.628.015.05.03.096.046.142.02.06.04.117.06.174.016.045.032.088.048.13.018.045.035.09.054.132z"/>
                    </svg>
                    Globalna Tablica Wyników
                </Link>
            </div>
        </div>
    );
};

export default ProgressPage;
