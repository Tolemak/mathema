import React from 'react';
import { categories, Question as QuestionType, Category } from '../data/mathProblems';
import { Link, useParams, useNavigate } from 'react-router-dom';

const BrowseModePage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const selectedCategory = categories.find(cat => cat.id === categoryId);

    React.useEffect(() => {
        if (!selectedCategory) {
            // Handle category not found, e.g., redirect or show error
            // For now, redirecting to practice area
            navigate('/practice');
        }
    }, [selectedCategory, navigate]);

    if (!selectedCategory) {
        // This case should ideally be handled by the useEffect redirect,
        // but as a fallback:
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
            <Link to="/practice" className="button">Wybierz inną kategorię lub tryb</Link>
            <div className="questions-list" style={{ marginTop: '20px' }}>
                {selectedCategory.questions.map((question, index) => (
                    <div key={question.id} className="question-item-browse">
                        <h3>Pytanie {index + 1}:</h3>
                        <p>{question.text}</p>
                        <p><strong>Odpowiedź:</strong> {question.answer}</p>
                        <p><small>Poziom: {question.schoolLevel}, Trudność: {question.difficulty}</small></p>
                    </div>
                ))}
            </div>
            <Link to="/practice" className="button" style={{ marginTop: '20px' }}>Wróć do wyboru trybu</Link>
        </div>
    );
};

export default BrowseModePage;
