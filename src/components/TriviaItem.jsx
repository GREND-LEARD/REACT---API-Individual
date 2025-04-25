import React, { useState, useMemo } from 'react';
import { useFavorites } from '../contexts/FavoritesContext'; // Importar hook
import { useScore } from '../contexts/ScoreContext'; // Importar useScore
import './TriviaItem.css'; // Crearemos este archivo para estilos

// Función auxiliar para decodificar entidades HTML (opcional pero recomendado)
// Podrías instalar una librería como 'he' (npm install he) para esto
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function TriviaItem({ question }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites(); // Usar contexto
  const { incrementScore, recordIncorrectAnswer } = useScore(); // Usar contexto de score
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Estado para respuesta seleccionada
  const [isAnswered, setIsAnswered] = useState(false); // Estado para saber si ya se respondió

  // Decodificar la pregunta y las respuestas
  const decodedQuestion = useMemo(() => decodeHtml(question.question), [question.question]);
  const correctAnswer = useMemo(() => decodeHtml(question.correct_answer), [question.correct_answer]);
  const incorrectAnswers = useMemo(() => question.incorrect_answers.map(decodeHtml), [question.incorrect_answers]);

  // Combinar y barajar respuestas (si es de opción múltiple)
  const allAnswers = useMemo(() => {
    let answers = [];
    if (question.type === 'multiple') {
      answers = [...incorrectAnswers, correctAnswer];
      // Barajar el array (algoritmo Fisher-Yates)
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
    } else {
      // Para verdadero/falso
      answers = ['True', 'False'];
    }
    return answers;
  }, [question.type, correctAnswer, incorrectAnswers]); // Dependencias clave

  const isFav = isFavorite(decodedQuestion); // Comprobar si es favorito

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(decodedQuestion); // Pasar texto decodificado
    } else {
      // Pasamos el objeto original `question` para tener todos los datos
      // pero usamos `decodedQuestion` para la comparación interna en el contexto
      addFavorite({ ...question, question: decodedQuestion }); 
    }
  };

  const handleAnswerClick = (answer) => {
    if (isAnswered) return; // No hacer nada si ya se respondió
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    // Actualizar puntuación
    if (answer === correctAnswer) {
      incrementScore();
    } else {
      recordIncorrectAnswer();
    }
  };

  const getButtonClass = (answer) => {
    if (!isAnswered) {
      return 'trivia-answer-button'; // Estilo normal
    }
    // Si ya se respondió:
    if (answer === correctAnswer) {
      return 'trivia-answer-button correct'; // Respuesta correcta siempre verde
    }
    if (answer === selectedAnswer) {
      return 'trivia-answer-button incorrect'; // Incorrecta seleccionada en rojo
    }
    return 'trivia-answer-button disabled'; // Otras incorrectas deshabilitadas/grises
  };

  return (
    <li className="trivia-item">
      <div className="item-content">
        <div className="trivia-category">{decodeHtml(question.category)} ({question.difficulty})</div>
        <div className="trivia-question">{decodedQuestion}</div>
        <div className="trivia-answers">
          {allAnswers.map((answer, index) => (
            <button 
              key={index} 
              className={getButtonClass(answer)} // Aplicar clase dinámica
              onClick={() => handleAnswerClick(answer)} // Manejar clic
              disabled={isAnswered} // Deshabilitar después de responder
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleFavoriteClick}
        className={`favorite-button ${isFav ? 'is-favorite' : ''}`}
        aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        {isFav ? '❤️' : '🤍'} {/* Corazón relleno o vacío */}
      </button>
    </li>
  );
}

export default TriviaItem; 