import React from 'react';
import { useScore } from '../contexts/ScoreContext';
import './ScoreDisplay.css';

function ScoreDisplay() {
  const { correctAnswers, totalAnswered } = useScore();

  return (
    <div className="score-display">
      Puntuación: {correctAnswers} / {totalAnswered}
      {/* Podríamos añadir un botón de reset aquí si quisiéramos */}
      {/* <button onClick={resetScore}>Reset</button> */}
    </div>
  );
}

export default ScoreDisplay; 