import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { categories, Category, SchoolLevel } from '../data/mathProblems';
import Topic from '../components/Topic';
import { useI18n } from '../i18n/useI18n';

const schoolLevelDisplayOrder: SchoolLevel[] = [
    'podstawowa_4_6',
    'podstawowa_7_8',
    'liceum_podst',
    'liceum_rozsz',
    'studia_tech_1rok'
];

const PracticeAreaPage: React.FC = () => {
    const { t, categoryName, levelName } = useI18n();
    const navigate = useNavigate();
    const location = useLocation(); 
    const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const modeFromQuery = new URLSearchParams(location.search).get('mode');
    const modeInUrl = modeFromQuery === 'interactive' || modeFromQuery === 'browse' ? modeFromQuery : null;

    const [selectedMode, setSelectedMode] = useState<'browse' | 'interactive'>(modeInUrl ?? 'browse');
    const [appliedSearch, setAppliedSearch] = useState(location.search);

    // The mode lives in the URL but stays switchable by the buttons below, so it
    // is re-synced on navigation rather than mirrored from an effect.
    if (appliedSearch !== location.search) {
        setAppliedSearch(location.search);
        if (modeInUrl !== null) {
            setSelectedMode(modeInUrl);
        }
    }

    const groupedCategories = useMemo(() => {
        const groups: Partial<Record<SchoolLevel, Category[]>> = {};
        schoolLevelDisplayOrder.forEach(sl => {
            groups[sl] = [];
        });

        categories.forEach(category => {
            const categorySchoolLevels = new Set<SchoolLevel>();
            category.questions.forEach(q => {
                categorySchoolLevels.add(q.schoolLevel);
            });

            categorySchoolLevels.forEach(sl => {
                if (groups[sl] && !groups[sl]!.find(c => c.id === category.id)) {
                    groups[sl]!.push(category);
                }
            });
        });
        
        const finalGroups: Record<string, Category[]> = {};
        for (const level of schoolLevelDisplayOrder) {
            if (groups[level] && groups[level]!.length > 0) {
                finalGroups[level] = groups[level]!;
            }
        }
        return finalGroups;
    }, []);

    const toggleLevel = (level: string) => {
        setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
    };

    const handleCategoryClick = (categoryId: string) => {
        if (selectedMode === 'interactive') {
            navigate(`/practice/interactive/${categoryId}`);
        } else {
            navigate(`/practice/browse/${categoryId}`);
        }
    };

    const filteredGroupedCategories = useMemo(() => {
        if (!searchTerm.trim()) {
            return groupedCategories;
        }
        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered: Record<string, Category[]> = {};
        for (const level in groupedCategories) {
            const matchingCategories = groupedCategories[level].filter(category =>
                categoryName(category.id, category.name).toLowerCase().includes(lowerSearchTerm)
            );
            if (matchingCategories.length > 0) {
                filtered[level] = matchingCategories;
            }
        }
        return filtered;
    }, [groupedCategories, searchTerm, categoryName]);


    return (
        <div className="page-container practice-area-page">
            <Topic>{t('practice.topic')}</Topic>
            <p className="lead">{t('practice.lead')}</p>

            <div className="mode-selection-buttons">
                <button
                    type="button"
                    onClick={() => setSelectedMode('browse')}
                    aria-pressed={selectedMode === 'browse'}
                    className="mode-button"
                >
                    {t('practice.modeBrowse')}
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedMode('interactive')}
                    aria-pressed={selectedMode === 'interactive'}
                    className="mode-button"
                >
                    {t('practice.modeInteractive')}
                </button>
            </div>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder={t('practice.search')}
                    aria-label={t('practice.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
            </div>

            {Object.keys(filteredGroupedCategories).length === 0 && searchTerm.trim() && (
                <p className="no-results-message">{t('practice.noMatch')}</p>
            )}

            {Object.keys(filteredGroupedCategories).map(level => (
                <div key={level} className="school-level-group">
                    <h2 className="school-level-title">
                        <button type="button" onClick={() => toggleLevel(level)} aria-expanded={Boolean(expandedLevels[level])}>
                            {levelName(level)}
                            <span className="arrow-indicator" aria-hidden="true">{expandedLevels[level] ? '−' : '+'}</span>
                        </button>
                    </h2>
                    {expandedLevels[level] && (
                        <ul className="category-list-tree">
                            {filteredGroupedCategories[level].map(category => (
                                <li key={category.id} className="category-list-item-tree">
                                    <button type="button" onClick={() => handleCategoryClick(category.id)}>{categoryName(category.id, category.name)}</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PracticeAreaPage;
