import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, Category } from '../data/mathProblems'; // Assuming Category type is exported

const PracticeAreaPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [mode, setMode] = useState<'interactive' | 'browse' | null>(null);
    const navigate = useNavigate();

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        // Reset mode when category changes, to force mode selection again
        setMode(null);
    };

    const handleModeSelect = (selectedMode: 'interactive' | 'browse') => {
        setMode(selectedMode);
        if (selectedCategory) {
            navigate(`/practice/${selectedMode}/${selectedCategory.id}`);
        }
    };

    return (
        <div className="container">
            <h1>Obszar Ćwiczeń</h1>
            <p>Witaj w Mathema! Tutaj możesz ćwiczyć swoje umiejętności matematyczne.</p>

            {!selectedCategory && (
                <>
                    <h2>Wybierz Kategorię:</h2>
                    <div className="category-selection">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategorySelect(category)}
                                className={`button category-button ${selectedCategory?.id === category.id ? 'active' : ''}`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {selectedCategory && !mode && (
                <>
                    <h2>Wybrana Kategoria: {selectedCategory.name}</h2>
                    <p>Wybierz tryb:</p>
                    <div className="mode-selection">
                        <button onClick={() => handleModeSelect('interactive')} className="button">
                            Tryb Interaktywny
                        </button>
                        <button onClick={() => handleModeSelect('browse')} className="button">
                            Tryb Przeglądania
                        </button>
                    </div>
                    <button onClick={() => setSelectedCategory(null)} className="button button-secondary" style={{marginTop: "10px"}}>
                        Zmień Kategorię
                    </button>
                </>
            )}
             <Link to="/" className="button button-secondary" style={{ marginTop: '20px' }}>Powrót do strony głównej</Link>
        </div>
    );
};

export default PracticeAreaPage;
