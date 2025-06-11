import React, { useState } from 'react';
import { categories, Question as QuestionType, Category } from '../data/mathProblems';
import Question from '../components/Question';
import Scoreboard from '../components/Scoreboard';
import { Link, useParams, useNavigate } from 'react-router-dom';

const InteractiveModePage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const selectedCategory = categories.find(cat => cat.id === categoryId);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>(selectedCategory ? Array(selectedCategory.questions.length).fill('') : []);
    const [showScoreboard, setShowScoreboard] = useState(false);

    React.useEffect(() => {
        // Reset state if category changes or is not found
        if (selectedCategory) {
            setCurrentQuestionIndex(0);
            setScore(0);
            setUserAnswers(Array(selectedCategory.questions.length).fill(''));
            setShowScoreboard(false);
        } else {
            // Handle category not found, e.g., redirect or show error
            // For now, redirecting to practice area
            navigate('/practice');
        }
    }, [selectedCategory, navigate]);


    const handleAnswerSubmit = (answer: string | number) => {
        if (!selectedCategory) return;

        const currentQuestion = selectedCategory.questions[currentQuestionIndex];
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = String(answer);
        setUserAnswers(newAnswers);

        if (String(currentQuestion.answer).toLowerCase() === String(answer).toLowerCase()) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < selectedCategory.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowScoreboard(true);
        }
    };

    const restartCategory = () => {
        if (selectedCategory) {
            setCurrentQuestionIndex(0);
            setScore(0);
            setUserAnswers(Array(selectedCategory.questions.length).fill(''));
            setShowScoreboard(false);
        }
    };

    if (!selectedCategory) {
        // This case should ideally be handled by the useEffect redirect,
        // but as a fallback:
        return (
            <div className="container">
                <p>Kategoria nie została znaleziona. Proszę wybrać kategorię z <Link to="/practice">listy</Link>.</p>
            </div>
        );
    }

    if (showScoreboard) {
        return (
            <div className="container">
                <h2>Wyniki dla kategorii: {selectedCategory.name}</h2>
                <Scoreboard
                    score={score}
                    totalQuestions={selectedCategory.questions.length}
                    questions={selectedCategory.questions}
                    userAnswers={userAnswers}
                />
                <button onClick={restartCategory} className="button">Spróbuj ponownie tę kategorię</button>
                <Link to="/practice" className="button">Wybierz inną kategorię lub tryb</Link>
            </div>
        );
    }

    const currentQuestion = selectedCategory.questions[currentQuestionIndex];

    return (
        <div className="container">
            <h1>Tryb Interaktywny</h1>
            <h2>Kategoria: {selectedCategory.name}</h2>
            <p>Pytanie {currentQuestionIndex + 1} z {selectedCategory.questions.length}</p>
            <Question
                question={currentQuestion.text}
                answer={currentQuestion.answer}
                onAnswer={handleAnswerSubmit}
            />
            <p>Twój wynik: {score} / {selectedCategory.questions.length}</p>
            <Link to="/practice" className="button button-secondary">Zmień kategorię lub tryb</Link>
        </div>
    );
};

export default InteractiveModePage;
