import React, { useState } from 'react';
import { Question as QuestionType } from '../data/mathProblems';
import { isAnswerCorrect } from '../utils/answerCheck';

interface QuestionProps {
  question: QuestionType;
  number?: number;
  submitLabel?: string;
  onSubmit: (isCorrect: boolean, answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, number, submitLabel = 'Zatwierdź', onSubmit }) => {
    const [userAnswer, setUserAnswer] = useState<string>('');

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(isAnswerCorrect(question.answer, userAnswer), userAnswer.trim());
        setUserAnswer('');
    };

    return (
        <div className="question-container">
            {number !== undefined && <p className="task-number">Zadanie {number}.</p>}
            <h2 className="task-text">{question.text}</h2>
            <form onSubmit={handleSubmitForm} className="answer-form">
                <label className="answer-label" htmlFor={`answer-${question.id}`}>Odp.</label>
                <input
                    id={`answer-${question.id}`}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Twoja odpowiedź"
                    required
                    autoComplete="off"
                    className="answer-input"
                />
                <button type="submit" className="button">{submitLabel}</button>
            </form>
        </div>
    );
};

export default Question;
