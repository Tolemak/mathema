import React, { useState, useEffect, useCallback } from 'react';
import { categories, Question as QuestionType, Category, SchoolLevel, Difficulty } from '../data/mathProblems';
import Question from '../components/Question';
import Scoreboard from '../components/Scoreboard';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { setCookie, getCookie, eraseCookie } from '../utils/cookies';
import { FaArrowCircleLeft, FaRedo, FaListOl } from 'react-icons/fa'; // Import icons

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


const saveLeaderboardData = (newEntry: LeaderboardEntry) => {
    let allEntries: LeaderboardEntry[] = [];
    const data = getCookie('leaderboard');
    if (data) {
        try {
            allEntries = JSON.parse(data);
        } catch (error) {
            allEntries = [];
        }
    }

    const existingEntryIndex = allEntries.findIndex(entry => entry.id === newEntry.id);

    if (existingEntryIndex > -1) {
        allEntries[existingEntryIndex] = newEntry;
    } else {
        allEntries.push(newEntry);
    }

    allEntries.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const limitedEntries = allEntries.slice(0, 50);

    try {
        setCookie('leaderboard', JSON.stringify(limitedEntries), 365);
    } catch (error) {
    }
};

const loadLeaderboardData = (categoryId?: string): LeaderboardEntry[] => {
    const data = getCookie('leaderboard');
    let globallySortedEntries: LeaderboardEntry[] = [];
    if (data) {
        try {
            globallySortedEntries = JSON.parse(data);
        } catch (error) {
            globallySortedEntries = [];
        }
    }

    if (categoryId) {
        const categoryEntries = globallySortedEntries.filter(entry => entry.categoryName === categoryId);
        return categoryEntries.slice(0, 10);
    }

    return globallySortedEntries;
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
    const [guestPlayerName, setGuestPlayerName] = useState<string>('');

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

    useEffect(() => {
        if (selectedCategory) {
            const initialQuestions = [...selectedCategory.questions];
            const guestName = getGuestId();
            setGuestPlayerName(guestName); // Set guest player name
            const stableEntryId = `${guestName}-${selectedCategory.id}`;

            const allSavedEntries = loadLeaderboardData();
            const userCategoryEntry = allSavedEntries.find(entry => entry.id === stableEntryId);

            if (userCategoryEntry) {
                setScore(userCategoryEntry.score);
                setLastGameEntry(userCategoryEntry);
            } else {
                setScore(0);
                setLastGameEntry(null);
            }
            
            setQuestionsAnswered(0);
            setShowScoreboard(false);
            setFinalDisplayedScore(0);
            setTotalSessionTime(0);
            setCurrentTimePerQuestion(0);
            setLeaderboardEntries(loadLeaderboardData(selectedCategory.name)); 
            selectRandomQuestion(initialQuestions); 
        } else {
            navigate('/practice');
        }
    }, [selectedCategory, categoryId, navigate]);

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

        let pointsForThisQuestion = 0;
        let currentCumulativeScore = score;

        if (isCorrect) {
            const difficultyMultiplier = difficultyMultipliers[currentQuestion.difficulty];
            const schoolLevelMultiplier = schoolLevelMultipliers[currentQuestion.schoolLevel];
            
            let timeBonus = 0;
            if (timeTaken <= MAX_TIME_BONUS_SECONDS) {
                timeBonus = (MAX_TIME_BONUS_SECONDS - timeTaken) / MAX_TIME_BONUS_SECONDS; 
            } else {
                timeBonus = - ( (timeTaken - MAX_TIME_BONUS_SECONDS) * TIME_PENALTY_FACTOR / MAX_TIME_BONUS_SECONDS );
            }
            const basePoints = BASE_SCORE_PER_QUESTION * difficultyMultiplier * schoolLevelMultiplier;
            const pointsFromTimeBonus = basePoints * timeBonus;
            pointsForThisQuestion = basePoints + pointsFromTimeBonus;
            
            pointsForThisQuestion = Math.max(pointsForThisQuestion, basePoints * 0.2); 

            currentCumulativeScore += pointsForThisQuestion; 
            setScore(currentCumulativeScore); 

            if (selectedCategory) { 
                const guestName = getGuestId(); 
                const stableEntryId = `${guestName}-${selectedCategory.id}`;

                const newEntry: LeaderboardEntry = {
                    id: stableEntryId, 
                    playerName: guestName.startsWith('guest_') ? `Gość ${guestName.substring(6,12)}` : guestName,
                    score: Math.round(currentCumulativeScore), 
                    categoryName: selectedCategory.name,
                    date: new Date().toISOString(),
                    difficulty: currentQuestion.difficulty, 
                    schoolLevel: currentQuestion.schoolLevel, 
                };
                saveLeaderboardData(newEntry);
                setLeaderboardEntries(loadLeaderboardData(selectedCategory.name)); 
                setLastGameEntry(newEntry); 
            }
        }
        
        setQuestionsAnswered(prevCount => prevCount + 1);

        if (availableQuestions.length > 0) {
            selectRandomQuestion(availableQuestions);
        } else {
            setFinalDisplayedScore(currentCumulativeScore); 
            setShowScoreboard(true);
            setCurrentQuestion(null); 
            setQuestionStartTime(0); 
            setCurrentTimePerQuestion(0); 
        }
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
            setLeaderboardEntries(loadLeaderboardData(selectedCategory.name)); 
            selectRandomQuestion(initialQuestions);
        }
    };

    // const handleEndSessionEarly = () => {
    //     setShowScoreboard(true);
    //     setFinalDisplayedScore(score); 
    //     setLeaderboardEntries(loadLeaderboardData(selectedCategory?.name)); 
    // };

    const handleRestart = () => {
        restartCategory();
    };

    if (!selectedCategory) {
        return (
            <div className="page-container">
                <p style={{ textAlign: 'center' }}>Kategoria nie została znaleziona. Proszę wybrać kategorię z <Link to="/practice">listy</Link>.</p>
            </div>
        );
    }

    if (showScoreboard) {
        let finalEntriesForTable = [...leaderboardEntries];
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
    
    const currentMultiplier = currentQuestion ? (difficultyMultipliers[currentQuestion.difficulty] * schoolLevelMultipliers[currentQuestion.schoolLevel]).toFixed(1) : '1';

    return (
        <div className="page-container interactive-mode-page">
            {selectedCategory ? (
                <>
                    <h1>Tryb Interaktywny: {selectedCategory.name}</h1>
                    
                    {showScoreboard ? (
                        <div className="finish-message">
                            <h2>Gratulacje! Ukończyłeś kategorię!</h2>
                            <p>Twój ostateczny wynik: {Math.round(finalDisplayedScore)}</p>
                            <p>Całkowity czas: {totalSessionTime.toFixed(1)} sekund</p>
                            <p>Odpowiedziałeś na {questionsAnswered} pytań.</p>
                            
                            {leaderboardEntries.length > 0 && (
                                <div className="leaderboard-section">
                                    <h3>Ranking dla tej kategorii:</h3>
                                    <LeaderboardTable 
                                        entries={leaderboardEntries} 
                                        highlightPlayerName={guestPlayerName} 
                                    />
                                </div>
                            )}

                            <div className="navigation-buttons">
                                <button onClick={handleRestart} className="button">
                                    <FaRedo className="nav-button-icon" /> Spróbuj ponownie
                                </button>
                                <Link to="/practice?mode=interactive" className="nav-button-link secondary">
                                    <FaListOl className="nav-button-icon" /> Wybierz inną kategorię
                                </Link>
                                <Link to="/" className="nav-button-link secondary">
                                    <FaArrowCircleLeft className="nav-button-icon" /> Strona główna
                                </Link>
                            </div>
                        </div>
                    ) : currentQuestion ? (
                        <>
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
                        </>
                    ) : (
                        <p className="loading-message">Ładowanie pytania...</p>
                    )}
                </>
            ) : (
                <p className="loading-message">Ładowanie kategorii...</p>
            )}
        </div>
    );
};

export default InteractiveModePage;
