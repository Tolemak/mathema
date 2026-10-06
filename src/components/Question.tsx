import React, { useState } from 'react';
import { Question as QuestionType } from '../data/mathProblems';
import { isAnswerCorrect } from '../utils/answerCheck';
import { useI18n } from '../i18n/useI18n';

interface QuestionProps {
  question: QuestionType;
  number?: number;
  submitLabel?: string;
  onSubmit: (isCorrect: boolean, answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, number, submitLabel, onSubmit }) => {
    const { t } = useI18n();
    const [userAnswer, setUserAnswer] = useState<string>('');

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(isAnswerCorrect(question.answer, userAnswer), userAnswer.trim());
        setUserAnswer('');
    };

    return (
        <div className="question-container">
            {number !== undefined && <p className="task-number">{t('question.number', { n: number })}</p>}
            <h2 className="task-text">{question.text}</h2>
            <form onSubmit={handleSubmitForm} className="answer-form">
                <label className="answer-label" htmlFor={`answer-${question.id}`}>{t('question.answerLabel')}</label>
                <input
                    id={`answer-${question.id}`}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={t('question.placeholder')}
                    required
                    autoComplete="off"
                    className="answer-input"
                />
                <button type="submit" className="button">{submitLabel ?? t('question.submit')}</button>
            </form>
        </div>
    );
};

export default Question;
