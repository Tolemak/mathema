import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { categories, Category, SchoolLevel } from '../data/mathProblems';
import { FaArrowCircleLeft } from 'react-icons/fa'; // Import the icon

const schoolLevelDisplayOrder: SchoolLevel[] = [
    'podstawowa_4_6',
    'podstawowa_7_8',
    'liceum_podst',
    'liceum_rozsz',
    'studia_tech_1rok'
];

const schoolLevelFriendlyNames: Record<SchoolLevel, string> = {
    'podstawowa_4_6': 'Szkoła Podstawowa (klasy 4-6)',
    'podstawowa_7_8': 'Szkoła Podstawowa (klasy 7-8)',
    'liceum_podst': 'Liceum/Technikum (poziom podstawowy)',
    'liceum_rozsz': 'Liceum/Technikum (poziom rozszerzony)',
    'studia_tech_1rok': 'Studia Techniczne (1 rok)'
};

const PracticeAreaPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMode, setSelectedMode] = useState<'browse' | 'interactive'>('browse');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const modeFromQuery = queryParams.get('mode') as 'browse' | 'interactive' | null;
        if (modeFromQuery) {
            setSelectedMode(modeFromQuery);
        }
    }, [location.search]);

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
                category.name.toLowerCase().includes(lowerSearchTerm)
            );
            if (matchingCategories.length > 0) {
                filtered[level] = matchingCategories;
            }
        }
        return filtered;
    }, [groupedCategories, searchTerm]);


    return (
        <div className="page-container practice-area-page">
            <h1>Obszar Ćwiczeń</h1>
            <p className="practice-area-subtitle">Wybierz tryb, a następnie kategorię zadań.</p>

            
            <div className="mode-selection-buttons">
                <button 
                    onClick={() => setSelectedMode('browse')} 
                    className={`button ${selectedMode === 'browse' ? '' : 'button-secondary'}`}
                >
                    Tryb Przeglądania
                </button>
                <button 
                    onClick={() => setSelectedMode('interactive')} 
                    className={`button ${selectedMode === 'interactive' ? '' : 'button-secondary'}`}
                >
                    Tryb Interaktywny
                </button>
            </div>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Filtruj kategorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
            </div>

            {Object.keys(filteredGroupedCategories).length === 0 && searchTerm.trim() && (
                <p className="no-results-message">Brak kategorii pasujących do wyszukiwania.</p>
            )}

            {Object.keys(filteredGroupedCategories).map(level => (
                <div key={level} className="school-level-group">
                    <h2 onClick={() => toggleLevel(level)} className="school-level-title">
                        {schoolLevelFriendlyNames[level as SchoolLevel] || level}
                        <span className={`arrow-indicator ${expandedLevels[level] ? 'expanded' : ''}`}>{expandedLevels[level] ? ' ▼' : ' ►'}</span>
                    </h2>
                    {expandedLevels[level] && (
                        <ul className="category-list-tree">
                            {filteredGroupedCategories[level].map(category => (
                                <li key={category.id} onClick={() => handleCategoryClick(category.id)} className="category-list-item-tree">
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div className="practice-area-nav-back">
                <Link to="/" className="nav-button-link secondary">
                    <FaArrowCircleLeft className="nav-button-icon" />
                    Wróć do strony głównej
                </Link>
            </div>
        </div>
    );
};

export default PracticeAreaPage;
