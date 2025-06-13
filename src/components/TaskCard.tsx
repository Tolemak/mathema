import React from 'react';
import { SchoolLevel, Difficulty } from '../data/mathProblems';

interface TaskCardProps {
  text: string;
  schoolLevel: SchoolLevel;
  difficulty: Difficulty;
}

const TaskCard: React.FC<TaskCardProps> = ({ text, schoolLevel, difficulty }) => {
  return (
    <div className="task-card">
      <p className="task-card-text"><strong>Zadanie:</strong> {text}</p>
      <p className="task-card-details">Poziom: {schoolLevel.replace(/_/g, ' ')}, Trudność: {difficulty}</p>
    </div>
  );
};

export default TaskCard;
