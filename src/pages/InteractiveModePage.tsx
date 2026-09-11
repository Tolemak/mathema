import React, { useState, useEffect, useCallback } from 'react';
import { categories, Question as QuestionType, SchoolLevel, Difficulty } from '../data/mathProblems';
import Question from '../components/Question';
import Scoreboard from '../components/Scoreboard';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { setCookie, getCookie } from '../utils/cookies';
import { fetchLeaderboard, fetchMyEntry, submitLeaderboardEntry } from '../utils/leaderboardApi';
import { FaListOl } from 'react-icons/fa';

const difficultyMultipliers: Record<Difficulty, number> = {
    'latwe': 1,
    'srednie': 1.5,
    'trudne': 2,
    'bardzo_trudne': 2.5,
};

const schoolLevelMultipliers: Record<SchoolLevel, number> = {
    'podstawowa_4_6': 1,
    'podstawowa_7_8': 1.2,
    'liceum_podst': 1.5,
    'liceum_rozsz': 2,
    'studia_tech_1rok': 2.5,
};

const BASE_SCORE_PER_QUESTION = 10;
const MAX_TIME_BONUS_SECONDS = 30; 
const TIME_PENALTY_FACTOR = 0.5;


const getGuestId = () => {
    let guestId = getCookie('guestId');
    if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        setCookie('guestId', guestId, 365);
    }
    return guestId;
};


// Best-effort: submits the guest's score to the shared leaderboard API.
// Gameplay never blocks on this — a failed submission just means this
// entry won't show up on the shared board, the session itself is unaffected.
const saveLeaderboardData = async (clientId: string, newEntry: LeaderboardEntry) => {
    try {
        await submitLeaderboardEntry({
            clientId,
            playerName: newEntry.playerName,
            categoryName: newEntry.categoryName,
            score: newEntry.score,
            difficulty: newEntry.difficulty,
            schoolLevel: newEntry.schoolLevel,
        });
    } catch (error) {
        console.error('Failed to submit score to leaderboard:', error);
    }
};

const loadLeaderboardData = async (categoryId?: string): Promise<LeaderboardEntry[]> => {
    try {
        return await fetchLeaderboard(categoryId, categoryId ? 10 : 100);
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
        return [];
    }
};


const InteractiveModePage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const selectedCategory = categories.find(cat => cat.id === categoryId);

    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [availableQuestions, setAvailableQuestions] = useState<QuestionType[]>([]);
    
    const [questionStartTime, setQuestionStartTime] = useState<number>(0);
    const [totalSessionTime, setTotalSessionTime] = useState<number>(0);
    const [currentTimePerQuestion, setCurrentTimePerQuestion] = useState<number>(0);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
    const [finalDisplayedScore, setFinalDisplayedScore] = useState<number>(0);
    const [lastGameEntry, setLastGameEntry] = useState<LeaderboardEntry | null>(null); 
    const [guestPlayerName] = useState<string>(getGuestId);

    const selectRandomQuestion = useCallback((questions: QuestionType[]) => {
        if (questions.length === 0) {
            setShowScoreboard(true);
            setCurrentQuestion(null);
            setQuestionStartTime(0); 
            setCurrentTimePerQuestion(0); 
            return;
        }
        const randomIndex = Math.floor(Math.random() * questions.length);
        const nextQuestion = questions[randomIndex];
        setCurrentQuestion(nextQuestion);
        setAvailableQuestions(questions.filter((_, index) => index !== randomIndex));
        setQuestionStartTime(Date.now()); 
        setCurrentTimePerQuestion(0);     
    }, [setShowScoreboard, setCurrentQuestion, setAvailableQuestions, setQuestionStartTime, setCurrentTimePerQuestion]); 

    // Resetting a session from an effect is the wrong shape - it should come
    // from remounting on categoryId. That is part of the pending rework of this
    // page, so the rule stays on everywhere else in the meantime.
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (selectedCategory) {
            const initialQuestions = [...selectedCategory.questions];
            const guestName = guestPlayerName;

            setScore(0);
            setLastGameEntry(null);
            setQuestionsAnswered(0);
            setShowScoreboard(false);
            setFinalDisplayedScore(0);
            setTotalSessionTime(0);
            setCurrentTimePerQuestion(0);
            selectRandomQuestion(initialQuestions);

            loadLeaderboardData(selectedCategory.name).then(setLeaderboardEntries);
            fetchMyEntry(guestName, selectedCategory.name).then((userCategoryEntry) => {
                if (userCategoryEntry) {
                    setScore(userCategoryEntry.score);
                    setLastGameEntry(userCategoryEntry);
                }
            }).catch((error) => console.error('Failed to load your saved score:', error));
        } else {
            navigate('/practice');
        }
    }, [selectedCategory, categoryId, navigate, guestPlayerName, selectRandomQuestion]);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        let timerId: number | null = null;
        if (questionStartTime > 0 && !showScoreboard) {
            timerId = window.setInterval(() => { 
                setCurrentTimePerQuestion((Date.now() - questionStartTime) / 1000);
            }, 100);
        }
        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [questionStartTime, showScoreboard]);


    const handleAnswerSubmit = (isCorrect: boolean) => {
        if (!selectedCategory || !currentQuestion) return;

        const timeTaken = (Date.now() - questionStartTime) / 1000; 
        setTotalSessionTime(prevTime => prevTime + timeTaken); 

        let currentCumulativeScore = score;

        if (isCorrect) {
            const difficultyMultiplier = difficultyMultipliers[currentQuestion.difficulty];
            const schoolLevelMultiplier = schoolLevelMultipliers[currentQuestion.schoolLevel];

            const timeBonus = timeTaken <= MAX_TIME_BONUS_SECONDS
                ? (MAX_TIME_BONUS_SECONDS - timeTaken) / MAX_TIME_BONUS_SECONDS
                : -((timeTaken - MAX_TIME_BONUS_SECONDS) * TIME_PENALTY_FACTOR / MAX_TIME_BONUS_SECONDS);

            const basePoints = BASE_SCORE_PER_QUESTION * difficultyMultiplier * schoolLevelMultiplier;
            const pointsForThisQuestion = Math.max(basePoints + basePoints * timeBonus, basePoints * 0.2);

            currentCumulativeScore += pointsForThisQuestion;
            setScore(currentCumulativeScore);
        }

        setQuestionsAnswered(prevCount => prevCount + 1);

        if (availableQuestions.length > 0) {
            selectRandomQuestion(availableQuestions);
            return;
        }

        setFinalDisplayedScore(currentCumulativeScore);
        setShowScoreboard(true);
        setCurrentQuestion(null);
        setQuestionStartTime(0);
        setCurrentTimePerQuestion(0);

        // Submitted once per session: the API throttles a client to one write
        // every couple of seconds, so a POST per answer was mostly rejected.
        const entry: LeaderboardEntry = {
            id: `${guestPlayerName}-${selectedCategory.name}`,
            playerName: guestPlayerName.startsWith('guest_')
                ? `Gość ${guestPlayerName.substring(6, 12)}`
                : guestPlayerName,
            score: Math.round(currentCumulativeScore),
            categoryName: selectedCategory.name,
            date: new Date().toISOString(),
            difficulty: currentQuestion.difficulty,
            schoolLevel: currentQuestion.schoolLevel,
        };

        setLastGameEntry(entry);
        saveLeaderboardData(guestPlayerName, entry).then(() =>
            loadLeaderboardData(selectedCategory.name).then(setLeaderboardEntries)
        );
    };

    const restartCategory = () => {
        if (selectedCategory) {
            const initialQuestions = [...selectedCategory.questions];
            
            setScore(0);
            setQuestionsAnswered(0);
            setShowScoreboard(false);
            setFinalDisplayedScore(0); 
            setTotalSessionTime(0);
            setCurrentTimePerQuestion(0);
            setLastGameEntry(null);
            loadLeaderboardData(selectedCategory.name).then(setLeaderboardEntries);
            selectRandomQuestion(initialQuestions);
        }
    };

    if (!selectedCategory) {
        return (
            <div className="page-container">
                <p style={{ textAlign: 'center' }}>Kategoria nie została znaleziona. Proszę wybrać kategorię z <Link to="/practice">listy</Link>.</p>
            </div>
        );
    }

    if (showScoreboard) {
        const finalEntriesForTable = [...leaderboardEntries];
        let currentHighlightId: string | undefined = undefined;

        if (lastGameEntry && selectedCategory && lastGameEntry.categoryName === selectedCategory.name) {
            currentHighlightId = lastGameEntry.id;
            const isPresent = finalEntriesForTable.some(e => e.id === lastGameEntry.id);
            if (!isPresent) {
                finalEntriesForTable.push(lastGameEntry);
            }
        }

        return (
            <div className="page-container">
                <h2 style={{ textAlign: 'center' }}>Wyniki dla kategorii: {selectedCategory.name}</h2>
                <Scoreboard
                    score={Math.round(finalDisplayedScore)} 
                    totalQuestions={questionsAnswered} 
                />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Całkowity czas: {totalSessionTime.toFixed(1)} sekund
                </p>
                 <p style={{ textAlign: 'center'}}>
                    Średni czas na zadanie: {(totalSessionTime / questionsAnswered || 0).toFixed(1)} sekund
                </p>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={restartCategory} className="button" style={{ marginRight: '10px' }}>Spróbuj ponownie tę kategorię</button>
                    <Link to="/practice" className="nav-button-link secondary">Wybierz inną kategorię</Link>
                </div>
                <LeaderboardTable entries={finalEntriesForTable} title={`Najlepsze wyniki: ${selectedCategory.name}`} highlightEntryId={currentHighlightId} />
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="page-container">
                <p style={{ textAlign: 'center' }}>Ładowanie pytania lub brak więcej pytań...</p>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/practice" className="nav-button-link secondary">Powrót do wyboru kategorii</Link>
                </div>
            </div>
        );
    }
    

    return (
        <div className="page-container interactive-mode-page">
            <h1>Tryb Interaktywny: {selectedCategory.name}</h1>

            <Scoreboard
                score={Math.round(score)}
                questionsAnswered={questionsAnswered}
                totalQuestions={selectedCategory.questions.length}
                timeLeft={currentTimePerQuestion}
                lastGameScore={lastGameEntry ? Math.round(lastGameEntry.score) : undefined}
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

export default InteractiveModePage;
