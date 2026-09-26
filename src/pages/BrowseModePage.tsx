import React, { useState, useMemo, useEffect } from 'react';
import { categories, SchoolLevel, Difficulty, schoolLevelNames } from '../data/mathProblems';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Topic from '../components/Topic';
import { useBarFields } from '../contexts/useBarFields';

const BrowseModePage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const selectedCategory = categories.find(cat => cat.id === categoryId);

    const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | 'all'>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
    const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});

    const [browsedCategoryId, setBrowsedCategoryId] = useState(categoryId);

    if (browsedCategoryId !== categoryId) {
        setBrowsedCategoryId(categoryId);
        setVisibleAnswers({});
    }

    useEffect(() => {
        if (!selectedCategory) {
            navigate('/practice');
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

    useBarFields([
        { label: 'dział', value: selectedCategory?.name ?? '' },
        { label: 'zadań', value: String(filteredQuestions.length) },
    ]);

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
            <Topic>{selectedCategory.name}</Topic>
            <p className="lead">Przeglądanie z odpowiedziami. <Link to="/practice?mode=browse">Wybierz inny dział</Link></p>

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
                            <option key={level} value={level}>{schoolLevelNames[level]}</option>
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
                            <h3 className="task-number">Zadanie {index + 1}.</h3>
                            <p className="task-text">{question.text}</p>
                            <button onClick={() => toggleAnswerVisibility(question.id)} className="button small toggle-answer-button">
                                {visibleAnswers[question.id] ? 'Ukryj' : 'Pokaż'} odpowiedź
                            </button>
                            {visibleAnswers[question.id] && (
                                <p className="answer-text"><span className="answer-label">Odp.</span> <span className="correction">{question.answer}</span></p>
                            )}
                            <p className="question-meta"><small>Poziom: {schoolLevelNames[question.schoolLevel]}, Trudność: {question.difficulty}</small></p>
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
