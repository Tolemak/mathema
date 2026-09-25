import React, { useState, useEffect, useRef } from 'react';
import { categories, Category, Question as QuestionType } from '../data/mathProblems';
import Question from '../components/Question';
import Scoreboard from '../components/Scoreboard';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link, Navigate, useParams } from 'react-router-dom';
import { fetchLeaderboard, fetchMyEntry, finishRound, startRound, submitAnswer } from '../utils/leaderboardApi';
import { pointsFor } from '../../server/scoring.js';
import { FaListOl } from 'react-icons/fa';

type SaveState = 'pending' | 'saved' | 'empty' | 'failed';

const saveMessages: Record<SaveState, string> = {
    pending: 'Zapisywanie wyniku...',
    saved: 'Wynik zapisany na tablicy.',
    empty: 'Brak punktów do zapisania.',
    failed: 'Nie udało się zapisać wyniku.',
};

const shuffle = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const loadLeaderboard = (categoryId: string): Promise<LeaderboardEntry[]> =>
    fetchLeaderboard(categoryId, 10).catch(() => []);

interface InteractiveSessionProps {
    category: Category;
    onRestart: () => void;
}

const InteractiveSession: React.FC<InteractiveSessionProps> = ({ category, onRestart }) => {
    const [questions] = useState<QuestionType[]>(() => shuffle(category.questions));
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [totalSessionTime, setTotalSessionTime] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());
    const [currentTimePerQuestion, setCurrentTimePerQuestion] = useState(0);
    const [bestEntry, setBestEntry] = useState<LeaderboardEntry | null>(null);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
    const [saveState, setSaveState] = useState<SaveState>('pending');
    const round = useRef<Promise<string | null>>(Promise.resolve(null));
    const answerQueue = useRef<Promise<void>>(Promise.resolve());

    const currentQuestion = questions[index] ?? null;

    useEffect(() => {
        round.current = startRound(category.id).catch(() => null);
        fetchMyEntry(category.id).then(setBestEntry).catch(() => setBestEntry(null));
        loadLeaderboard(category.id).then(setLeaderboardEntries);
    }, [category.id]);

    useEffect(() => {
        if (!currentQuestion) return;
        const timerId = window.setInterval(() => {
            setCurrentTimePerQuestion((Date.now() - questionStartTime) / 1000);
        }, 100);
        return () => clearInterval(timerId);
    }, [questionStartTime, currentQuestion]);

    const finishSession = () => {
        answerQueue.current
            .then(async () => {
                const roundId = await round.current;
                if (!roundId) throw new Error('Round was not started');
                const result = await finishRound(roundId);
                if (result.entry) setBestEntry(result.entry);
                setSaveState(result.entry ? 'saved' : 'empty');
                setLeaderboardEntries(await loadLeaderboard(category.id));
            })
            .catch(() => setSaveState('failed'));
    };

    const handleAnswerSubmit = (isCorrect: boolean) => {
        if (!currentQuestion) return;

        const now = Date.now();
        const timeTaken = (now - questionStartTime) / 1000;
        const questionId = currentQuestion.id;

        if (isCorrect) setScore(prev => prev + pointsFor(currentQuestion, timeTaken));
        setTotalSessionTime(prev => prev + timeTaken);
        setIndex(prev => prev + 1);
        setQuestionStartTime(now);
        setCurrentTimePerQuestion(0);

        answerQueue.current = answerQueue.current
            .then(async () => {
                const roundId = await round.current;
                if (roundId) await submitAnswer(roundId, questionId, isCorrect);
            })
            .catch(() => undefined);

        if (index + 1 === questions.length) finishSession();
    };

    if (!currentQuestion) {
        const entries = bestEntry && !leaderboardEntries.some(e => e.id === bestEntry.id)
            ? [...leaderboardEntries, bestEntry]
            : leaderboardEntries;

        return (
            <div className="page-container">
                <h2 style={{ textAlign: 'center' }}>Wyniki dla kategorii: {category.name}</h2>
                <Scoreboard
                    score={Math.round(score)}
                    totalQuestions={questions.length}
                    bestScore={bestEntry ? Math.round(bestEntry.score) : undefined}
                />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Całkowity czas: {totalSessionTime.toFixed(1)} sekund
                </p>
                <p style={{ textAlign: 'center' }}>
                    Średni czas na zadanie: {(totalSessionTime / questions.length || 0).toFixed(1)} sekund
                </p>
                <p style={{ textAlign: 'center' }} role="status">{saveMessages[saveState]}</p>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={onRestart} className="button" style={{ marginRight: '10px' }}>Spróbuj ponownie tę kategorię</button>
                    <Link to="/practice" className="nav-button-link secondary">Wybierz inną kategorię</Link>
                </div>
                <LeaderboardTable entries={entries} title={`Najlepsze wyniki: ${category.name}`} />
            </div>
        );
    }

    return (
        <div className="page-container interactive-mode-page">
            <h1>Tryb Interaktywny: {category.name}</h1>

            <Scoreboard
                score={Math.round(score)}
                questionsAnswered={index}
                totalQuestions={questions.length}
                timeLeft={currentTimePerQuestion}
                bestScore={bestEntry ? Math.round(bestEntry.score) : undefined}
            />
            <Question
                question={currentQuestion}
                onSubmit={handleAnswerSubmit}
                key={currentQuestion.id}
            />
            <div className="interactive-mode-controls">
                <Link to="/practice?mode=interactive" className="button secondary small nav-button-link">
                    <FaListOl className="nav-button-icon" /> Wróć do wyboru kategorii
                </Link>
            </div>
        </div>
    );
};

const InteractiveModePage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [attempt, setAttempt] = useState(0);
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) return <Navigate to="/practice" replace />;

    return (
        <InteractiveSession
            key={`${category.id}-${attempt}`}
            category={category}
            onRestart={() => setAttempt(prev => prev + 1)}
        />
    );
};

export default InteractiveModePage;
