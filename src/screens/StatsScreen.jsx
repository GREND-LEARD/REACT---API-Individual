import React from 'react';
import { useScore } from '../contexts/ScoreContext';
import { useFavorites } from '../contexts/FavoritesContext';
import './StatsScreen.css'; // Para estilos

function StatsScreen() {
  const { correctAnswers, totalAnswered, resetScore } = useScore();
  const { favorites } = useFavorites();

  const accuracy = totalAnswered > 0 ? ((correctAnswers / totalAnswered) * 100).toFixed(1) : 0;

  return (
    <div className="stats-container">
      <h1>Estadísticas</h1>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{totalAnswered}</span>
          <span className="stat-label">Respondidas</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{correctAnswers}</span>
          <span className="stat-label">Correctas</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{accuracy}%</span>
          <span className="stat-label">Precisión</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{favorites.length}</span>
          <span className="stat-label">Favoritas</span>
        </div>
      </div>

      {totalAnswered > 0 && (
          <button onClick={resetScore} className="reset-button">
              Reiniciar Puntuación
          </button>
      )}

    </div>
  );
}

export default StatsScreen; 