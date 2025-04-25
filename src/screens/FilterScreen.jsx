import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api/triviaApi';
import './FilterScreen.css'; // Para estilos

function FilterScreen() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // '' para "Any Category"
  const [selectedDifficulty, setSelectedDifficulty] = useState(''); // '' para "Any Difficulty"
  const [selectedType, setSelectedType] = useState(''); // '' para "Any Type"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        setError('Error al cargar las categorías.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
    if (selectedType) params.append('type', selectedType);

    // Navegar a HomeScreen con los parámetros
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="filter-screen-container">
      <h1>Filtrar Preguntas</h1>

      {loading && <p>Cargando categorías...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="category-select">Categoría:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Cualquier Categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="difficulty-select">Dificultad:</label>
            <select
              id="difficulty-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">Cualquier Dificultad</option>
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-select">Tipo:</label>
            <select
              id="type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Cualquier Tipo</option>
              <option value="multiple">Opción Múltiple</option>
              <option value="boolean">Verdadero / Falso</option>
            </select>
          </div>

          <button onClick={handleApplyFilters} className="apply-filters-button">
            Aplicar Filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterScreen; 