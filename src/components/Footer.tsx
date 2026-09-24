import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} Mathema</p>
      <p>Stworzone z pasją do matematyki i nowoczesnych technologii.</p>
      <p className="footer-links">
        <a href="https://kamil-galkowski.pl" target="_blank" rel="noopener noreferrer">
          Kamil Gałkowski · portfolio
        </a>
        {' · '}
        <a href="https://github.com/Tolemak/mathema" target="_blank" rel="noopener noreferrer">
          Kod na GitHubie
        </a>
      </p>
    </footer>
  );
};

export default Footer;
