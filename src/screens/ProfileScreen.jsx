import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../api/supabaseClient';
import './ProfileScreen.css';
import './AuthScreen.css';

function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || !confirmNewPassword) {
      setError('Ambos campos de contraseña son obligatorios.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoadingUpdate(true);
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }
      
      setMessage('Contraseña actualizada exitosamente. Es posible que necesites confirmar este cambio por correo.');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(`Error al actualizar contraseña: ${err.message}`);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container auth-container">
        <h1>Perfil de Usuario</h1>
        <p>Por favor, inicia sesión para ver tu perfil.</p>
        <button onClick={() => navigate('/login')} className="profile-button auth-button">
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Perfil de Usuario</h1>
      
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{user.email}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">ID de Usuario:</span>
          <span className="profile-value">{user.id}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Estado de Email:</span>
          <span className="profile-value">
            {user.email_confirmed_at ? 'Confirmado' : 'No confirmado'}
          </span>
        </div>
      </div>

      <hr className="profile-divider" />

      <div className="change-password-section">
        <h2>Cambiar Contraseña</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleChangePassword} className="auth-form profile-form">
          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input 
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
            <input 
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button profile-button" disabled={loadingUpdate}>
            {loadingUpdate ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
      
      <hr className="profile-divider" />

      <div className="profile-actions">
        <button onClick={handleLogout} className="profile-button logout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default ProfileScreen; 