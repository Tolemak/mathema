import React, { useState } from 'react';

interface QuestionProps {
  question: string;
  answer: string | number; // Odpowiedź może być stringiem lub liczbą
  onAnswer: (isCorrect: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({ question, answer, onAnswer }) => {
    const [userAnswer, setUserAnswer] = useState<string>(''); // Odpowiedź użytkownika jest początkowo stringiem

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let isCorrect = false;

        if (typeof answer === 'number') {
            // Jeśli poprawna odpowiedź jest liczbą, parsujemy odpowiedź użytkownika
            const userAnswerAsNumber = parseFloat(userAnswer);
            if (!isNaN(userAnswerAsNumber)) {
                isCorrect = userAnswerAsNumber === answer;
            }
        } else {
            // Jeśli poprawna odpowiedź jest stringiem, porównujemy je (ignorując wielkość liter i białe znaki na końcach)
            isCorrect = userAnswer.trim().toLowerCase() === String(answer).trim().toLowerCase();
        }
        
        onAnswer(isCorrect);
        setUserAnswer(''); // Resetuj pole input
    };

    return (
        <div className="question-container">
            <h2>{question}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" // Zmieniono na text, aby umożliwić różne formaty odpowiedzi
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