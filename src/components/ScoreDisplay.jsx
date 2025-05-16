import React from 'react';
import { useScore } from '../contexts/ScoreContext';
import './ScoreDisplay.css';
// Importar íconos
import { FaTrophy, FaCheck, FaTimes } from 'react-icons/fa';

function ScoreDisplay() {
  const { correctAnswers, totalAnswered, incorrectAnswers } = useScore();
  
  // Calcular porcentaje para la barra de progreso
  const percentage = totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

  return (
    <div className="score-display">
      <div className="score-content">
        <div className="score-trophy">
          <FaTrophy className="trophy-icon" />
          <div className="score-value">{correctAnswers}</div>
        </div>

        <div className="score-details">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="score-stats">
            <div className="stat correct">
              <FaCheck /> <span>{correctAnswers}</span>
            </div>
            <div className="stat incorrect">
              <FaTimes /> <span>{incorrectAnswers}</span>
            </div>
            <div className="stat total">
              <span>Total: {totalAnswered}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreDisplay; 