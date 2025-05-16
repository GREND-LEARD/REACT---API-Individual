import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './BottomNav.css'; // Crearemos este archivo para estilos

function BottomNav() {
  const { user } = useAuth();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Lista</NavLink>
      <NavLink to="/filter" className={({ isActive }) => isActive ? 'active' : ''}>Filtro</NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>Buscar</NavLink>
      <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>Favoritos</NavLink>
      <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>Estadísticas</NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
        {user ? 'Perfil' : 'Acceder'}
      </NavLink>
    </nav>
  );
}

export default BottomNav; 