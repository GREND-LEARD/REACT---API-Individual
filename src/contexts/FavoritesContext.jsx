import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabaseClient';
import { useAuth } from './AuthContext';

// 1. Crear el Contexto
const FavoritesContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useFavorites = () => {
  return useContext(FavoritesContext);
};

// 2. Crear el Provider
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Cargar favoritos desde Supabase o localStorage dependiendo del estado de auth
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (user) {
          // Si hay usuario, cargar de Supabase
          const { data, error: supabaseError } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id);
            
          if (supabaseError) throw supabaseError;
          
          // Convertir la columna de question_data de JSON a objeto
          const parsedFavorites = data.map(item => {
            return { 
              ...item.question_data,
              favorite_id: item.id // Guardar el ID de la BD para facilitar eliminación
            };
          });
          
          setFavorites(parsedFavorites);
        } else {
          // Si no hay usuario, cargar de localStorage como fallback
          const savedFavorites = localStorage.getItem('triviaFavorites');
          setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
        }
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
        setError('Error al cargar tus favoritos');
        
        // Si hay error, intentar cargar de localStorage como respaldo
        const savedFavorites = localStorage.getItem('triviaFavorites');
        setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, [user]);

  // Si no hay usuario, guardar en localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('triviaFavorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Función para añadir una pregunta a favoritos
  const addFavorite = async (question) => {
    // Evitar duplicados (basado en el texto de la pregunta)
    if (favorites.some(fav => fav.question === question.question)) {
      return; // Ya existe este favorito
    }
    
    try {
      if (user) {
        // Si hay usuario, guardar en Supabase
        const { data, error: supabaseError } = await supabase
          .from('favorites')
          .insert([{ 
            user_id: user.id,
            question_data: question,
            created_at: new Date()
          }])
          .select();
          
        if (supabaseError) throw supabaseError;
        
        // Actualizar estado con el nuevo ítem que incluye ID de BD
        setFavorites(prevFavorites => [
          ...prevFavorites, 
          { ...question, favorite_id: data[0].id }
        ]);
      } else {
        // Si no hay usuario, guardar solo en estado (y luego en localStorage por el efecto)
        setFavorites(prevFavorites => [...prevFavorites, question]);
      }
    } catch (err) {
      console.error('Error al añadir favorito:', err);
      // Si hay error, al menos actualizamos el estado local
      setFavorites(prevFavorites => [...prevFavorites, question]);
    }
  };

  // Función para quitar una pregunta de favoritos
  const removeFavorite = async (questionText) => {
    try {
      // Primero encontramos el favorito para obtener su ID si existe
      const favToRemove = favorites.find(fav => fav.question === questionText);
      
      if (user && favToRemove && favToRemove.favorite_id) {
        // Si hay usuario y tenemos el ID en BD, eliminar de Supabase
        const { error: supabaseError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', favToRemove.favorite_id);
          
        if (supabaseError) throw supabaseError;
      }
      
      // En cualquier caso, actualizar el estado local
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.question !== questionText)
      );
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
      // Si hay error, al menos actualizamos el estado local
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.question !== questionText)
      );
    }
  };

  // Función para comprobar si una pregunta es favorita
  const isFavorite = (questionText) => {
    return favorites.some(fav => fav.question === questionText);
  };

  // El valor que proveerá el contexto
  const value = {
    favorites,
    loading,
    error,
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