import React, { createContext, useState, useContext } from 'react';

// 1. Crear Contexto
const ScoreContext = createContext();

// Hook personalizado
export const useScore = () => {
  return useContext(ScoreContext);
};

// 2. Crear Provider
export const ScoreProvider = ({ children }) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Función para incrementar la puntuación
  const incrementScore = () => {
    setCorrectAnswers(prevScore => prevScore + 1);
    setTotalAnswered(prevTotal => prevTotal + 1);
  };

  // Función para registrar una respuesta incorrecta (solo incrementa el total)
  const recordIncorrectAnswer = () => {
    setTotalAnswered(prevTotal => prevTotal + 1);
  };

  // Función para resetear (opcional, por si queremos un botón de reinicio)
  const resetScore = () => {
    setCorrectAnswers(0);
    setTotalAnswered(0);
  };

  const value = {
    correctAnswers,
    totalAnswered,
    incrementScore,
    recordIncorrectAnswer,
    resetScore,
  };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
}; 