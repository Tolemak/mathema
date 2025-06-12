import React, { useState } from 'react';

interface QuestionProps {
  question: string;
  answer: string | number; 
  onAnswer: (isCorrect: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({ question, answer, onAnswer }) => {
    const [userAnswer, setUserAnswer] = useState<string>(''); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let isCorrect = false;

        if (typeof answer === 'number') {
            
            const userAnswerAsNumber = parseFloat(userAnswer);
            if (!isNaN(userAnswerAsNumber)) {
                isCorrect = userAnswerAsNumber === answer;
            }
        } else {
            
            isCorrect = userAnswer.trim().toLowerCase() === String(answer).trim().toLowerCase();
        }
        
        onAnswer(isCorrect);
        setUserAnswer(''); 
    };

    return (
        <div className="question-container">
            <h2>{question}</h2>
            <form onSubmit={handleSubmit}>
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