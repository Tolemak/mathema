import React, { useState } from 'react';
import { Question as QuestionType } from '../data/mathProblems';
import { isStringAnswerCorrect } from '../utils/answerCheck';

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
            // Accept Polish comma-decimals ("3,5") alongside periods — still
            // an exact numeric match, just tolerant of the separator used.
            const userAnswerAsNumber = parseFloat(userAnswer.trim().replace(',', '.'));
            if (!isNaN(userAnswerAsNumber)) {
                isCorrect = userAnswerAsNumber === question.answer;
            }
        } else {
            isCorrect = isStringAnswerCorrect(userAnswer, String(question.answer));
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