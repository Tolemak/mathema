import React, { useState } from 'react';
import { categories, schoolLevelNames } from '../data/mathProblems';
import Question from './Question';
import MarkedAnswer from './MarkedAnswer';

const allTasks = categories.flatMap((category) =>
  category.questions.map((question) => ({ question, categoryName: category.name })),
);

const pickTask = () => allTasks[Math.floor(Math.random() * allTasks.length)];

interface Attempt {
  given: string;
  correct: boolean;
}

// One random task to try straight away, checked on the spot; points are only counted in the interactive mode.
const DailyTask: React.FC = () => {
  const [task, setTask] = useState(pickTask);
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const next = () => {
    setTask(pickTask());
    setAttempt(null);
  };

  return (
    <section className="daily-task" aria-label="Zadanie na dziś">
      <p className="task-meta">{task.categoryName}, {schoolLevelNames[task.question.schoolLevel]}</p>
      {attempt ? (
        <div className="question-container">
          <h2 className="task-text">{task.question.text}</h2>
          <p className="worked-answer">
            <span className="answer-label">Odp.</span>
            <MarkedAnswer given={attempt.given} correct={attempt.correct} expected={task.question.answer} />
          </p>
          <button type="button" className="button" onClick={next}>Następne zadanie</button>
        </div>
      ) : (
        <Question
          key={task.question.id}
          question={task.question}
          submitLabel="Sprawdź"
          onSubmit={(correct, given) => setAttempt({ correct, given })}
        />
      )}
    </section>
  );
};

export default DailyTask;
