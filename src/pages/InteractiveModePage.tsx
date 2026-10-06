import React, { useState, useEffect, useRef } from 'react';
import { categories, Category, Question as QuestionType } from '../data/mathProblems';
import Question from '../components/Question';
import Scoreboard from '../components/Scoreboard';
import MarkedAnswer from '../components/MarkedAnswer';
import Topic from '../components/Topic';
import { useBarFields } from '../contexts/useBarFields';
import { useI18n } from '../i18n/useI18n';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link, Navigate, useParams } from 'react-router-dom';
import { fetchLeaderboard, fetchMyEntry, finishRound, startRound, submitAnswer } from '../utils/leaderboardApi';
import type { MessageKey } from '../i18n/dictionary';
import { pointsFor } from '../../server/scoring.js';

type SaveState = 'pending' | 'saved' | 'empty' | 'failed';

interface Worked {
    question: QuestionType;
    given: string;
    correct: boolean;
}

const saveKeys = {
    pending: 'save.pending',
    saved: 'save.saved',
    empty: 'save.empty',
    failed: 'save.failed',
} as const satisfies Record<SaveState, MessageKey>;

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
    const { t, categoryName, formatNumber } = useI18n();
    const localName = categoryName(category.id, category.name);
    const [questions] = useState<QuestionType[]>(() => shuffle(category.questions));
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [totalSessionTime, setTotalSessionTime] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());
    const [currentTimePerQuestion, setCurrentTimePerQuestion] = useState(0);
    const [bestEntry, setBestEntry] = useState<LeaderboardEntry | null>(null);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
    const [saveState, setSaveState] = useState<SaveState>('pending');
    const [worked, setWorked] = useState<Worked[]>([]);
    const round = useRef<Promise<string | null>>(Promise.resolve(null));
    const answerQueue = useRef<Promise<void>>(Promise.resolve());

    const currentQuestion = questions[index] ?? null;
    const lastMiss = worked.map((w) => w.correct).lastIndexOf(false);
    const streak = worked.length - lastMiss - 1;

    useBarFields([
        { label: t('bar.section'), value: localName },
        { label: t('bar.task'), value: `${Math.min(index + 1, questions.length)}/${questions.length}` },
        { label: t('bar.score'), value: String(Math.round(score)), tone: 'accent' },
        { label: t('bar.streak'), value: String(streak) },
    ]);

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

    const handleAnswerSubmit = (isCorrect: boolean, given: string) => {
        if (!currentQuestion) return;

        const now = Date.now();
        const timeTaken = (now - questionStartTime) / 1000;
        const questionId = currentQuestion.id;

        if (isCorrect) setScore(prev => prev + pointsFor(currentQuestion, timeTaken));
        setTotalSessionTime(prev => prev + timeTaken);
        setWorked(prev => [...prev, { question: currentQuestion, given, correct: isCorrect }]);
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
                <Topic>{t('interactive.results', { category: localName })}</Topic>
                <Scoreboard
                    score={Math.round(score)}
                    totalQuestions={questions.length}
                    bestScore={bestEntry ? Math.round(bestEntry.score) : undefined}
                />
                <p className="round-times">
                    {t('interactive.totalTime', { n: formatNumber(totalSessionTime, 1) })}{' '}
                    {t('interactive.avgTime', { n: formatNumber(totalSessionTime / questions.length || 0, 1) })}
                </p>
                <p className="save-status" role="status">{t(saveKeys[saveState])}</p>
                <div className="actions">
                    <button onClick={onRestart} className="button">{t('interactive.retry')}</button>
                    <Link to="/practice?mode=interactive" className="button secondary">{t('interactive.other')}</Link>
                </div>
                <WorkedList worked={worked} />
                <LeaderboardTable entries={entries} title={t('interactive.bestOf', { category: localName })} />
            </div>
        );
    }

    return (
        <div className="page-container interactive-mode-page">
            <Topic>{localName}</Topic>

            <Scoreboard
                score={Math.round(score)}
                questionsAnswered={index}
                totalQuestions={questions.length}
                timeLeft={currentTimePerQuestion}
                bestScore={bestEntry ? Math.round(bestEntry.score) : undefined}
            />
            <Question
                question={currentQuestion}
                number={index + 1}
                onSubmit={handleAnswerSubmit}
                key={currentQuestion.id}
            />
            <WorkedList worked={worked} />
            <div className="actions">
                <Link to="/practice?mode=interactive" className="button secondary">{t('interactive.back')}</Link>
            </div>
        </div>
    );
};

const WorkedList: React.FC<{ worked: Worked[] }> = ({ worked }) => {
    const { t } = useI18n();
    if (worked.length === 0) return null;
    return (
        <section className="worked" aria-label={t('interactive.worked')}>
            <ol>
                {worked.map((item) => (
                    <li key={item.question.id}>
                        <p className="worked-text">{item.question.text}</p>
                        <p className="worked-answer">
                            <span className="answer-label">{t('question.answerLabel')}</span>
                            <MarkedAnswer given={item.given} correct={item.correct} expected={item.question.answer} />
                        </p>
                    </li>
                ))}
            </ol>
        </section>
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
