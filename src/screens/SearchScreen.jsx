import React, { useState, useEffect } from 'react';
import { fetchTriviaQuestions } from '../api/triviaApi';
import TriviaItem from '../components/TriviaItem';
import './SearchScreen.css'; // Estilos

// Función auxiliar para decodificar (la necesitamos para comparar)
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allQuestions, setAllQuestions] = useState([]); // Preguntas base de la API
  const [filteredQuestions, setFilteredQuestions] = useState([]); // Preguntas filtradas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Función para cargar preguntas iniciales
  const loadInitialQuestions = async () => {
    if (loading || initialLoadDone) return; // Evitar recargas si ya se cargó o está cargando
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTriviaQuestions({ amount: 50 }); 
      if (data.response_code === 0) {
        const decodedQuestions = data.results.map(q => ({ ...q, question: decodeHtml(q.question) }));
        setAllQuestions(decodedQuestions);
        setFilteredQuestions(decodedQuestions);
        setInitialLoadDone(true);
      } else {
        setError(`Error de la API (${data.response_code}). Intenta de nuevo más tarde.`);
        setInitialLoadDone(false); // Permitir reintentar si falla
      }
    } catch (err) {
      setError('Error de red al cargar preguntas. Intenta de nuevo más tarde.');
      console.error(err);
      setInitialLoadDone(false); // Permitir reintentar si falla
    } finally {
      setLoading(false);
    }
  };

  // Filtrar preguntas cuando el término de búsqueda cambie
  useEffect(() => {
    if (!initialLoadDone) return; // No filtrar si no hay preguntas base

    if (!searchTerm) {
      setFilteredQuestions(allQuestions);
      return;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = allQuestions.filter(q => 
      q.question.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredQuestions(results);
  }, [searchTerm, allQuestions, initialLoadDone]); // Añadir initialLoadDone a dependencias

  return (
    <div className="search-screen-container">
      <h1>Buscar Preguntas</h1>
      
      <div className="search-controls">
        {/* Botón para cargar preguntas si aún no se ha hecho */} 
        {!initialLoadDone && !loading && (
            <button onClick={loadInitialQuestions} className="load-button">
              Cargar Preguntas para Buscar
            </button>
        )}
        
        {/* Mostrar input solo después de cargar o si está cargando */}
        {(initialLoadDone || loading) && (
          <input 
            type="text"
            placeholder="Buscar en las preguntas cargadas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={loading} // Deshabilitar input mientras carga
          />
        )}
      </div>

      {loading && <p>Cargando preguntas base...</p>}
      
      {/* Mostrar error solo si no está cargando */}
      {!loading && error && <p className="error-message">{error}</p>}

      {initialLoadDone && !loading && !error && (
        <ul className="trivia-list"> 
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q, index) => (
              <TriviaItem key={`${q.question}-${index}`} question={q} />
            ))
          ) : (
            // Mostrar solo si hay término de búsqueda y no hay resultados
            searchTerm && <p>No se encontraron preguntas que coincidan con "{searchTerm}".</p>
          )}
        </ul>
      )}
      
      {/* Mensaje inicial antes de cargar */}
      {!initialLoadDone && !loading && !error && (
         <p>Haz clic en "Cargar Preguntas para Buscar" para empezar.</p>
      )}
    </div>
  );
}

export default SearchScreen; 