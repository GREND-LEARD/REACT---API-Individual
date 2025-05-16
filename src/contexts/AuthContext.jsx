import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabaseClient';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para inicializar el auth
  useEffect(() => {
    console.log('Inicializando Auth Provider');

    // Verificar si hay una sesión inicial
    const checkUser = async () => {
      try {
        console.log('Verificando usuario...');
        setLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al verificar sesión:', error.message);
          throw error;
        }
        
        console.log('Sesión obtenida:', data.session ? 'Existe' : 'No existe');
        const initialUser = data.session ? data.session.user : null;
        setUser(initialUser);
        
      } catch (error) {
        console.error('Error en checkUser:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Ejecutar verificación inicial
    checkUser();
    
    // Suscribirse a los cambios de auth
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Cambio de estado de autenticación:', event);
      setUser(session?.user || null);
    });
    
    // Cleanup
    return () => {
      data?.subscription?.unsubscribe();
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