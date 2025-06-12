import React, { useState, useEffect, useCallback } from 'react';
import { categories, Question as QuestionType, Category, SchoolLevel, Difficulty } from '../data/mathProblems';
import Question from '../components/Question';
import Scoreboard from '../components/Scoreboard';
import LeaderboardTable, { LeaderboardEntry } from '../components/LeaderboardTable';
import { Link, useParams, useNavigate } from 'react-router-dom';

const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const eraseCookie = (name: string) => {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};


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
        <div className="page-container">
            <h1 style={{ textAlign: 'center' }}>Tryb Interaktywny</h1>
            <h2 style={{ textAlign: 'center' }}>Kategoria: {selectedCategory.name}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                <p>Zadanie {questionsAnswered + 1} (Pozostało: {availableQuestions.length})</p>
                <p>Czas na zadanie: {currentTimePerQuestion.toFixed(1)}s</p>
            </div>
            <Question
                question={currentQuestion.text}
                answer={currentQuestion.answer}
                onAnswer={handleAnswerSubmit}
            />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p>Twój wynik: {Math.round(score)}</p>
                <p>Mnożnik punktów: {currentMultiplier}x (Poziom: {currentQuestion.schoolLevel}, Trudność: {currentQuestion.difficulty})</p>
                <p>Bonus za czas (max {MAX_TIME_BONUS_SECONDS}s): zielony poniżej, czerwony powyżej</p>
                 <div style={{
                    width: '100%',
                    backgroundColor: '#ddd',
                    borderRadius: '5px',
                    marginTop: '5px'
                }}>
                    <div style={{
                        width: `${Math.min(100, (currentTimePerQuestion / MAX_TIME_BONUS_SECONDS) * 100)}%`,
                        backgroundColor: currentTimePerQuestion <= MAX_TIME_BONUS_SECONDS ? 'green' : 'red',
                        height: '10px',
                        borderRadius: '5px',
                        transition: 'width 0.1s ease-in-out'
                    }}></div>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/practice?mode=interactive" className="nav-button-link secondary">Zmień kategorię</Link>
            </div>
        </div>
    );
};

export default InteractiveModePage;
