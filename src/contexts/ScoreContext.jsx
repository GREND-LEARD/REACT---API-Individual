import React, { createContext, useContext, useState } from 'react';

// Crear contexto
const ScoreContext = createContext();

// Hook personalizado para usar el contexto
export function useScore() {
  return useContext(ScoreContext);
}

// Proveedor del contexto
export function ScoreProvider({ children }) {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Incrementar aciertos
  const incrementScore = () => {
    setCorrectAnswers(prev => prev + 1);
    setTotalAnswered(prev => prev + 1);
  };

  // Registrar respuestas incorrectas
  const recordIncorrectAnswer = () => {
    setIncorrectAnswers(prev => prev + 1);
    setTotalAnswered(prev => prev + 1);
  };

  // Reset score
  const resetScore = () => {
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTotalAnswered(0);
  };

  // Valor que proveeremos al contexto
  const value = {
    correctAnswers,
    incorrectAnswers,
    totalAnswered,
    incrementScore,
    recordIncorrectAnswer,
    resetScore
  };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
} 