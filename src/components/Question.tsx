import React, { useState } from 'react';
import { Question as QuestionType } from '../data/mathProblems';

interface QuestionProps {
  question: QuestionType;
  onSubmit: (isCorrect: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({ question, onSubmit }) => {
    const [userAnswer, setUserAnswer] = useState<string>('');

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        let isCorrect = false;

        if (typeof question.answer === 'number') {
            const userAnswerAsNumber = parseFloat(userAnswer);
            if (!isNaN(userAnswerAsNumber)) {
                isCorrect = userAnswerAsNumber === question.answer;
            }
        } else {
            isCorrect = userAnswer.trim().toLowerCase() === String(question.answer).trim().toLowerCase();
        }

        onSubmit(isCorrect);
        setUserAnswer('');
    };

    return (
        <div className="question-container">
            <h2>{question.text}</h2>
            <form onSubmit={handleSubmitForm}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Twoja odpowiedź"
                    required
                    className="answer-input"
                />
                <button type="submit" className="submit-button">Zatwierdź</button>
            </form>
        </div>
    );
};

export default Question;