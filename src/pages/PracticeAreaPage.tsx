import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { categories, Category, SchoolLevel } from '../data/mathProblems';


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
            <p style={{ textAlign: 'center' }}>Wybierz tryb, a następnie kategorię zadań.</p>

            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
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
                <p>Brak kategorii pasujących do wyszukiwania.</p>
            )}

            {Object.keys(filteredGroupedCategories).map(level => (
                <div key={level} className="school-level-group">
                    <h2 onClick={() => toggleLevel(level)} style={{ cursor: 'pointer' }}>
                        {schoolLevelFriendlyNames[level as SchoolLevel] || level}
                        <span className={expandedLevels[level] ? 'expanded-arrow' : ''}>{expandedLevels[level] ? ' ▼' : ' ►'}</span>
                    </h2>
                    {expandedLevels[level] && (
                        <ul className="category-list-tree">
                            {filteredGroupedCategories[level].map(category => (
                                <li key={category.id} onClick={() => handleCategoryClick(category.id)} className="category-list-item-tree" style={{ cursor: 'pointer' }}>
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link to="/" className="nav-button-link secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px'}}>
                        <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v2.036a.25.25 0 0 0 .25.25h2.036a.5.5 0 0 1 .5.5v1.172A3.499 3.499 0 0 1 11.501 8a3.5 3.5 0 0 1-3.501 3.501A3.499 3.499 0 0 1 4.328 9.672a.5.5 0 0 1 .5-.5h2.036a.25.25 0 0 0 .25-.25V7.036a.5.5 0 0 1 .5-.5H8V.5A.5.5 0 0 1 8 0zM4.5 6.938A3.501 3.501 0 0 1 8 3.5c1.186 0 2.24.578 2.899 1.475L8.5 7.414V11.5a.5.5 0 0 1-1 0V7.414L5.05 4.975A3.484 3.484 0 0 1 4.5 6.938z"/>
                        <path fillRule="evenodd" d="M7.5 11.5A3.5 3.5 0 0 1 4 8c0-1.186.578-2.24 1.475-2.899L7.914 7.5H4.5a.5.5 0 0 1 0-1h3.414L5.025 3.101A3.484 3.484 0 0 1 7.5 2.5a3.5 3.5 0 0 1 3.5 3.5c0 .262-.03.518-.086.766L12.586 5H10.5a.5.5 0 0 1 0-1h2.086l1.707 1.707A3.486 3.486 0 0 1 15.5 8a3.5 3.5 0 0 1-3.5 3.5c-.262 0-.518-.03-.766-.086L10 12.586V10.5a.5.5 0 0 1 1 0v2.086l-1.707 1.707A3.486 3.486 0 0 1 7.5 15.5a3.5 3.5 0 0 1-3.5-3.5c0-.262.03-.518.086-.766L3.414 10H5.5a.5.5 0 0 1 0 1H3.414l-1.707-1.707A3.486 3.486 0 0 1 .5 8a3.5 3.5 0 0 1 3.5-3.5c.262 0 .518.03.766.086L6 3.414V5.5a.5.5 0 0 1-1 0V3.414l1.707-1.707A3.486 3.486 0 0 1 7.5.5a3.5 3.5 0 0 1 3.5 3.5c0 .262-.03.518-.086.766L12.086 6H10.5a.5.5 0 0 1 0-1h2.086l1.707-1.707A3.486 3.486 0 0 1 15.5 4.5a3.5 3.5 0 0 1-3.5 3.5c-.262 0-.518.03-.766.086L10 9.086V11.5a.5.5 0 0 1-1 0V9.086l-1.707-1.707A3.486 3.486 0 0 1 5.5 4.5a3.5 3.5 0 0 1 3.5-3.5c.262 0 .518.03.766.086L11.586 3H9.5a.5.5 0 0 1 0-1h2.086L9.879.121A3.499 3.499 0 0 1 8 0a3.5 3.5 0 0 1-3.5 3.5c0 .262.03.518.086.766L3 6.586V4.5a.5.5 0 0 1 1 0v2.086l1.707 1.707A3.486 3.486 0 0 1 7.5 11.5z"/>
                        <path d="M10.828 10.828a.5.5 0 0 1 0 .707L8.707 13.657a.5.5 0 0 1-.707 0L5.172 10.828a.5.5 0 1 1 .707-.707L8 12.293l2.121-2.122a.5.5 0 0 1 .707 0z"/>
                    </svg>
                    Powrót do strony głównej
                </Link>
            </div>
        </div>
    );
};

export default PracticeAreaPage;
