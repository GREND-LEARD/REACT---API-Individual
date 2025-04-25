import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchTriviaQuestions } from '../api/triviaApi';
import TriviaItem from '../components/TriviaItem';
import './HomeScreen.css';

function HomeScreen() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const type = searchParams.get('type');

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = { amount: 10 };
      if (category) filters.category = category;
      if (difficulty) filters.difficulty = difficulty;
      if (type) filters.type = type;

      console.log('Fetching questions with filters:', filters);

      const data = await fetchTriviaQuestions(filters);

      if (data.response_code === 0) {
        setQuestions(data.results);
      } else if (data.response_code === 1) {
        setError('No se encontraron preguntas con esos filtros.');
        setQuestions([]);
      } else {
        setError(`Error de la API (${data.response_code}). Intenta de nuevo más tarde.`);
        setQuestions([]);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) {
        setError('Demasiadas solicitudes. Por favor espera 5 segundos y recarga o intenta de nuevo.');
      } else {
        setError('Error de red al cargar preguntas. Intenta de nuevo más tarde.');
      }
      console.error(err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty, type]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      loadQuestions();
    }, 50);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [category, difficulty, type, loadQuestions]);

  const handleFetchNewQuestions = () => {
    loadQuestions();
  };

  return (
    <div className="home-screen-container">
      <div className="header-controls">
        <h1>Preguntas de Trivia</h1>
        {!loading && (
          <button onClick={handleFetchNewQuestions} className="refresh-button" disabled={loading}>
            Nuevas Preguntas ✨
          </button>
        )}
      </div>

      {loading && <p>Cargando preguntas...</p>}

      {!loading && error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <ul className="trivia-list">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <TriviaItem key={`${q.question}-${index}`} question={q} />
            ))
          ) : (
            <p>No se encontraron preguntas.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default HomeScreen; 