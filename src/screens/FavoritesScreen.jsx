import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import TriviaItem from '../components/TriviaItem';

function FavoritesScreen() {
  const { favorites } = useFavorites();

  return (
    <div>
      <h1>Mis Preguntas Favoritas</h1>

      {favorites.length === 0 ? (
        <p>Aún no has añadido ninguna pregunta a favoritos. ¡Marca algunas con ❤️!</p>
      ) : (
        <ul className="trivia-list">
          {favorites.map((q, index) => (
            <TriviaItem key={`${q.question}-${index}`} question={q} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesScreen; 