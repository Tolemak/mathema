import React from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: React.ReactElement<IconType>;
  title: string;
  description: string;
  linkTo: string;
  linkLabel: string;
  buttonClassName: string; 
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, linkTo, linkLabel, buttonClassName }) => {
  return (
    <div className="feature-card">
      <div className="feature-card-icon">{icon}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
      <Link to={linkTo} className={`feature-link ${buttonClassName}`}>
        {linkLabel}
      </Link>
    </div>
  );
};

export default FeatureCard;
