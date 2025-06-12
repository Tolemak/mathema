import React, { useState, useMemo, useEffect } from 'react';
import { categories, Question as QuestionType, Category, SchoolLevel, Difficulty } from '../data/mathProblems';
import { Link, useParams, useNavigate } from 'react-router-dom';

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
            <div className="page-container"> 
                <p style={{ textAlign: 'center' }}>Kategoria nie została znaleziona. Proszę wybrać kategorię z <Link to="/practice">listy</Link>.</p>
            </div>
        );
    }

    return (
        <div className="page-container browse-mode-page"> 
            <h1 style={{ textAlign: 'center' }}>Tryb Przeglądania</h1>
            <h2 style={{ textAlign: 'center' }}>Kategoria: {selectedCategory.name}</h2>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}> 
                <Link to="/practice" className="nav-button-link secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16" style={{ marginRight: '8px'}}>
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
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
                        className="button button-secondary small" 
                    >
                        Wyczyść filtry
                    </button>
                )}
            </div>

            <div className="questions-list" style={{ marginTop: '30px' }}>
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => (
                        <div key={question.id} className="question-item-browse" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fdfdfd'}}>
                            <h3>Zadanie {index + 1}:</h3>
                            <p>{question.text}</p>
                            <button onClick={() => toggleAnswerVisibility(question.id)} className="button small" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                {visibleAnswers[question.id] ? 'Ukryj' : 'Pokaż'} odpowiedź
                            </button>
                            {visibleAnswers[question.id] && (
                                <p style={{ padding: '10px', backgroundColor: '#e9f5ff', borderRadius: '4px' }}><strong>Odpowiedź:</strong> {question.answer}</p>
                            )}
                            <p style={{ marginTop: '10px' }}><small>Poziom: {question.schoolLevel.replace(/_/g, ' ')}, Trudność: {question.difficulty}</small></p>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center' }}>Brak zadań spełniających wybrane kryteria filtrowania.</p>
                )}
            </div>
        </div>
    );
};

export default BrowseModePage;
