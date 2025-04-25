import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Crear el Contexto
const FavoritesContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useFavorites = () => {
  return useContext(FavoritesContext);
};

// 2. Crear el Provider
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos iniciales desde localStorage
    const savedFavorites = localStorage.getItem('triviaFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Guardar en localStorage cada vez que cambien los favoritos
  useEffect(() => {
    localStorage.setItem('triviaFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Función para añadir una pregunta a favoritos
  // Guardaremos el objeto completo de la pregunta
  const addFavorite = (question) => {
    // Evitar duplicados (basado en el texto de la pregunta, ya que no hay ID único fiable)
    if (!favorites.some(fav => fav.question === question.question)) {
      setFavorites(prevFavorites => [...prevFavorites, question]);
    }
  };

  // Función para quitar una pregunta de favoritos
  const removeFavorite = (questionText) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.question !== questionText));
  };

  // Función para comprobar si una pregunta es favorita
  const isFavorite = (questionText) => {
    return favorites.some(fav => fav.question === questionText);
  };

  // El valor que proveerá el contexto
  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 