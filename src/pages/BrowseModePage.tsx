import React, { useState, useMemo, useEffect } from 'react';
import { categories, SchoolLevel, Difficulty } from '../data/mathProblems';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Topic from '../components/Topic';
import { useI18n } from '../i18n/useI18n';
import { useBarFields } from '../contexts/useBarFields';

const BrowseModePage: React.FC = () => {
    const { t, categoryName, levelName, difficultyName } = useI18n();
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
        { label: t('bar.section'), value: selectedCategory ? categoryName(selectedCategory.id, selectedCategory.name) : '' },
        { label: t('bar.tasks'), value: String(filteredQuestions.length) },
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
                <p>{t('browse.notFound')} <Link to="/practice">{t('browse.notFoundList')}</Link>.</p>
            </div>
        );
    }

    return (
        <div className="page-container browse-mode-page">
            <Topic>{categoryName(selectedCategory.id, selectedCategory.name)}</Topic>
            <p className="lead">{t('browse.lead')} <Link to="/practice?mode=browse">{t('browse.another')}</Link></p>

            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="schoolLevelFilter">{t('browse.level')}</label>
                    <select
                        id="schoolLevelFilter"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value as SchoolLevel | 'all')}
                        className="filter-select"
                    >
                        <option value="all">{t('browse.allLevels')}</option>
                        {schoolLevels.map(level => (
                            <option key={level} value={level}>{levelName(level)}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="difficultyFilter">{t('browse.difficulty')}</label>
                    <select
                        id="difficultyFilter"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
                        className="filter-select"
                    >
                        <option value="all">{t('browse.allDifficulties')}</option>
                        {difficulties.map(diff => (
                            <option key={diff} value={diff}>{difficultyName(diff)}</option>
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
                        {t('browse.clear')}
                    </button>
                )}
            </div>

            <div className="questions-list">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => (
                        <div key={question.id} className="question-item-browse">
                            <h3 className="task-number">{t('question.number', { n: index + 1 })}</h3>
                            <p className="task-text">{question.text}</p>
                            <button onClick={() => toggleAnswerVisibility(question.id)} className="button small toggle-answer-button">
                                {visibleAnswers[question.id] ? t('browse.hide') : t('browse.show')}
                            </button>
                            {visibleAnswers[question.id] && (
                                <p className="answer-text"><span className="answer-label">{t('question.answerLabel')}</span> <span className="correction">{question.answer}</span></p>
                            )}
                            <p className="question-meta"><small>{t('browse.meta', { level: levelName(question.schoolLevel), difficulty: difficultyName(question.difficulty) })}</small></p>
                        </div>
                    ))
                ) : (
                    <p className="no-questions-message">{t('browse.empty')}</p>
                )}
            </div>
        </div>
    );
};

export default BrowseModePage;
