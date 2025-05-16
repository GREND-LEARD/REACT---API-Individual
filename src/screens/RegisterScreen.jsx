import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../api/supabaseClient'; // Importamos supabase directamente
import './AuthScreen.css'; // Compartiremos estilos con LoginScreen

function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetear error
    setFormError('');
    
    // Validaciones básicas
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Intentar registrar directamente usando el cliente de Supabase
    try {
      setLoading(true);
      console.log('Intentando registrar usuario directamente:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('Respuesta del registro:', data ? 'OK' : 'Error', error ? error.message : '');
      
      if (error) {
        console.error('Error al registrar:', error.message);
        setFormError(error.message);
        return;
      }
      
      // Redireccionar a login con mensaje de éxito
      navigate('/login', { 
        state: { 
          message: 'Registro exitoso. Por favor, revisa tu email para confirmar tu cuenta.' 
        } 
      });
    } catch (err) {
      console.error('Error inesperado al registrar:', err.message);
      setFormError('Error inesperado al registrar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Crear Cuenta</h1>
      
      {/* Mostrar errores */}
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
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="auth-button"
        >
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>
      
      <div className="auth-link">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
      </div>
    </div>
  );
}

export default RegisterScreen; 