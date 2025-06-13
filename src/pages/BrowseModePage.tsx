import React, { useState, useMemo, useEffect } from 'react';
import { categories, Question as QuestionType, Category, SchoolLevel, Difficulty } from '../data/mathProblems';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa'; // Changed to FaArrowCircleLeft

const BrowseModePage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const selectedCategory = categories.find(cat => cat.id === categoryId);

    const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | 'all'>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
    const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!selectedCategory) {
            navigate('/practice');
        } else {
            // Reset visible answers when category changes or on initial load
            setVisibleAnswers({});
        }
    }, [selectedCategory, navigate]);

    const schoolLevels: SchoolLevel[] = useMemo(() => {
        if (!selectedCategory) return [];
        const levels = new Set(selectedCategory.questions.map(q => q.schoolLevel));
        return Array.from(levels).sort(); 
    }, [selectedCategory]);

    const difficulties: Difficulty[] = useMemo(() => {
        if (!selectedCategory) return [];
        const diffs = new Set(selectedCategory.questions.map(q => q.difficulty));
        return Array.from(diffs).sort(); 
    }, [selectedCategory]);

    const filteredQuestions = useMemo(() => {
        if (!selectedCategory) return [];
        return selectedCategory.questions.filter(question => {
            const levelMatch = selectedLevel === 'all' || question.schoolLevel === selectedLevel;
            const difficultyMatch = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
            return levelMatch && difficultyMatch;
        });
    }, [selectedCategory, selectedLevel, selectedDifficulty]);

    const toggleAnswerVisibility = (questionId: string) => {
        setVisibleAnswers(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    if (!selectedCategory) {
        return (
            <div className="page-container browse-mode-page-error">
                <p>Kategoria nie została znaleziona. Proszę wybrać kategorię z <Link to="/practice">listy</Link>.</p>
            </div>
        );
    }

    return (
        <div className="page-container browse-mode-page">
            <h1 className="browse-mode-title">Tryb Przeglądania</h1>
            <h2 className="browse-mode-category-title">Kategoria: {selectedCategory.name}</h2>
            
            <div className="browse-mode-nav-back">
                <Link to="/practice" className="nav-button-link secondary">
                    <FaArrowCircleLeft className="nav-button-icon" /> {/* Changed to FaArrowCircleLeft */}
                    Wybierz inną kategorię
                </Link>
            </div>

            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="schoolLevelFilter">Poziom:</label>
                    <select
                        id="schoolLevelFilter"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value as SchoolLevel | 'all')}
                        className="filter-select"
                    >
                        <option value="all">Wszystkie poziomy</option>
                        {schoolLevels.map(level => (
                            <option key={level} value={level}>{level.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="difficultyFilter">Trudność:</label>
                    <select
                        id="difficultyFilter"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
                        className="filter-select"
                    >
                        <option value="all">Wszystkie trudności</option>
                        {difficulties.map(diff => (
                            <option key={diff} value={diff}>{diff}</option>
                        ))}
                    </select>
                </div>
                {(selectedLevel !== 'all' || selectedDifficulty !== 'all') && (
                    <button
                        onClick={() => {
                            setSelectedLevel('all');
                            setSelectedDifficulty('all');
                        }}
                        className="button button-secondary small clear-filters-button"
                    >
                        Wyczyść filtry
                    </button>
                )}
            </div>

            <div className="questions-list">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => (
                        <div key={question.id} className="question-item-browse">
                            <h3>Zadanie {index + 1}:</h3>
                            <p>{question.text}</p>
                            <button onClick={() => toggleAnswerVisibility(question.id)} className="button small toggle-answer-button">
                                {visibleAnswers[question.id] ? 'Ukryj' : 'Pokaż'} odpowiedź
                            </button>
                            {visibleAnswers[question.id] && (
                                <p className="answer-text"><strong>Odpowiedź:</strong> {question.answer}</p>
                            )}
                            <p className="question-meta"><small>Poziom: {question.schoolLevel.replace(/_/g, ' ')}, Trudność: {question.difficulty}</small></p>
                        </div>
                    ))
                ) : (
                    <p className="no-questions-message">Brak zadań spełniających wybrane kryteria filtrowania.</p>
                )}
            </div>
        </div>
    );
};

export default BrowseModePage;
