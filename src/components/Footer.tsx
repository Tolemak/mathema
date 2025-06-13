import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} Mathema. Wszelkie prawa zastrzeżone.</p>
      <p>Stworzone z pasją do matematyki i nowoczesnych technologii.</p>
    </footer>
  );
};

export default Footer;
