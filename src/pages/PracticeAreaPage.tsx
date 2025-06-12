import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, Category, SchoolLevel } from '../data/mathProblems';

// Define a display order and friendly names for school levels
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
    const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState(''); // For future filtering

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
        navigate(`/practice/browse/${categoryId}`);
    };

    // Filter categories based on search term (simple name search for now)
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
        <div className="container practice-area-page">
            <h1>Obszar Ćwiczeń</h1>
            <p>Wybierz kategorię zadań z poniższej listy, aby rozpocząć przeglądanie.</p>

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
                    <h2 onClick={() => toggleLevel(level)}>
                        {schoolLevelFriendlyNames[level as SchoolLevel] || level}
                        <span className={expandedLevels[level] ? 'expanded-arrow' : ''}>{expandedLevels[level] ? ' ▼' : ' ►'}</span>
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
            <Link to="/" className="nav-button-link secondary" style={{ marginTop: '30px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px'}}>
                    <path d="M8.5 10.975V5.522l-.447.447-.414-.04L8.5 4.5l.86.429-.413.04-.447-.447v5.453l.447-.447.414.04L8.5 11.5l-.86-.429.413-.04.447.447z"/>
                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.495V14.5h-3z"/>
                    <path d="M12.5 11.025V7.522l-.447.447-.414-.04L12.5 6.5l.86.429-.413.04-.447-.447v3.503l.447-.447.414.04L12.5 13.5l-.86-.429.413-.04.447.447z"/>
                    <path d="M2 13.5V7h3v6.5H2zM11 13.5V7h3v6.5h-3zM5 6.5V3h6v3.5H5zM4.5 2A.5.5 0 0 0 4 2.5v11a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-7z"/>
                </svg>
                Powrót do strony głównej
            </Link>
        </div>
    );
};

export default PracticeAreaPage;
