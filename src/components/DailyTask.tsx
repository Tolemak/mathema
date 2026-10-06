import React, { useState } from 'react';
import { categories } from '../data/mathProblems';
import { useI18n } from '../i18n/useI18n';
import Question from './Question';
import MarkedAnswer from './MarkedAnswer';

const allTasks = categories.flatMap((category) =>
  category.questions.map((question) => ({ question, categoryId: category.id, categoryName: category.name })),
);

const pickTask = () => allTasks[Math.floor(Math.random() * allTasks.length)];

interface Attempt {
  given: string;
  correct: boolean;
}

const DailyTask: React.FC = () => {
  const { t, categoryName, levelName } = useI18n();
  const [task, setTask] = useState(pickTask);
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const next = () => {
    setTask(pickTask());
    setAttempt(null);
  };

  return (
    <section className="daily-task" aria-label={t('daily.aria')}>
      <p className="task-meta">{categoryName(task.categoryId, task.categoryName)}, {levelName(task.question.schoolLevel)}</p>
      {attempt ? (
        <div className="question-container">
          <h2 className="task-text">{task.question.text}</h2>
          <p className="worked-answer">
            <span className="answer-label">{t('question.answerLabel')}</span>
            <MarkedAnswer given={attempt.given} correct={attempt.correct} expected={task.question.answer} />
          </p>
          <button type="button" className="button" onClick={next}>{t('daily.next')}</button>
        </div>
      ) : (
        <Question
          key={task.question.id}
          question={task.question}
          submitLabel={t('daily.check')}
          onSubmit={(correct, given) => setAttempt({ correct, given })}
        />
      )}
    </section>
  );
};

export default DailyTask;
