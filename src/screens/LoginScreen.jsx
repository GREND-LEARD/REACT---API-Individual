import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../api/supabaseClient'; // Importar supabase directamente
import './AuthScreen.css'; // Crearemos este archivo después

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Para mensajes de éxito
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Para acceder al state de la navegación

  // Efecto para mostrar el mensaje de registro exitoso
  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el state de la ubicación para que el mensaje no reaparezca al navegar atrás y adelante
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Limpiar errores previos
    setSuccessMessage(''); // Limpiar mensajes de éxito previos
    
    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    // Intentar iniciar sesión directamente con Supabase
    try {
      setLoading(true);
      console.log('Intentando iniciar sesión directamente:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Respuesta del login:', data ? 'OK' : 'Error', error ? error.message : '');
      
      if (error) {
        console.error('Error al iniciar sesión:', error.message);
        setFormError(error.message);
        return;
      }
      
      // Redireccionar a la página principal si el login es exitoso
      navigate('/');
    } catch (err) {
      console.error('Error inesperado al iniciar sesión:', err.message);
      setFormError('Error inesperado al iniciar sesión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Iniciar Sesión</h1>
      
      {/* Mostrar mensaje de éxito (ej. después del registro) */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Mostrar errores de formulario o de API */}
      {formError && <div className="auth-error">{formError}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="auth-button"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <div className="auth-link">
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </div>
    </div>
  );
}

export default LoginScreen; 