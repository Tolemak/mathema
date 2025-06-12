import React, { useState, useMemo } from 'react';
import { categories, Question as QuestionType, Category, SchoolLevel, Difficulty } from '../data/mathProblems';
import { Link, useParams, useNavigate } from 'react-router-dom';

const BrowseModePage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const selectedCategory = categories.find(cat => cat.id === categoryId);

    const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | 'all'>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

    React.useEffect(() => {
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

    if (!selectedCategory) {
        return (
            <div className="container">
                <p>Kategoria nie została znaleziona. Proszę wybrać kategorię z <Link to="/practice">listy</Link>.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Tryb Przeglądania</h1>
            <h2>Kategoria: {selectedCategory.name}</h2>
            <Link to="/practice" className="nav-button-link secondary" style={{ marginBottom: '20px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
                Wybierz inną kategorię
            </Link>

            <div className="filters">
                <label htmlFor="schoolLevelFilter">Poziom:</label>
                <select
                    id="schoolLevelFilter"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as SchoolLevel | 'all')}
                >
                    <option value="all">Wszystkie poziomy</option>
                    {schoolLevels.map(level => (
                        <option key={level} value={level}>{level.replace(/_/g, ' ')}</option>
                    ))}
                </select>

                <label htmlFor="difficultyFilter">Trudność:</label>
                <select
                    id="difficultyFilter"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
                >
                    <option value="all">Wszystkie trudności</option>
                    {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                    ))}
                </select>
                {(selectedLevel !== 'all' || selectedDifficulty !== 'all') && (
                    <button
                        onClick={() => {
                            setSelectedLevel('all');
                            setSelectedDifficulty('all');
                        }}
                        className="clear-filters-button"
                    >
                        Wyczyść filtry
                    </button>
                )}
            </div>

            <div className="questions-list" style={{ marginTop: '20px' }}>
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => (
                        <div key={question.id} className="question-item-browse">
                            <h3>Zadanie {index + 1}:</h3>
                            <p>{question.text}</p>
                            <p><strong>Odpowiedź:</strong> {question.answer}</p>
                            <p><small>Poziom: {question.schoolLevel.replace(/_/g, ' ')}, Trudność: {question.difficulty}</small></p>
                        </div>
                    ))
                ) : (
                    <p>Brak zadań spełniających wybrane kryteria filtrowania.</p>
                )}
            </div>
        </div>
    );
};

export default BrowseModePage;
