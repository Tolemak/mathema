import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topic from '../components/Topic';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="page-container">
      <Topic>Strona 404</Topic>
      <p>Nie znaleziono strony lub zasobu.</p>
      <Link to="/" className="button">Powrót na stronę główną</Link>
    </div>
  );
};

export default NotFoundPage;
