import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabaseClient';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para inicializar el auth
  useEffect(() => {
    console.log('Inicializando Auth Provider');

    // Verificar la conexión con Supabase
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) throw error;
      } catch (err) {
        console.error('Error de conexión con Supabase:', err);
        setError('Error de conexión con la base de datos. Por favor, verifica tu conexión a internet.');
      }
    };

    checkConnection();

    // Obtener sesión actual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error al obtener la sesión:', err);
        setError('Error al cargar la sesión. Por favor, intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Función para registrar un usuario
  const register = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Intentando registrar usuario:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error en registro:', error.message);
        throw error;
      }
      
      console.log('Registro exitoso:', data);
      return data;
    } catch (error) {
      console.error('Error en register():', error.message);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Intentando iniciar sesión:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error en login:', error.message);
        throw error;
      }
      
      console.log('Login exitoso:', data);
      return data;
    } catch (error) {
      console.error('Error en login():', error.message);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Cerrando sesión...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error en logout:', error.message);
        throw error;
      }
      
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error en logout():', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Valor que proporcionará el contexto
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 