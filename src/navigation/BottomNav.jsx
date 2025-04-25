import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css'; // Crearemos este archivo para estilos

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Lista</NavLink>
      <NavLink to="/filter" className={({ isActive }) => isActive ? 'active' : ''}>Filtro</NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>Buscar</NavLink>
      <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>Favoritos</NavLink>
      <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>Estadísticas</NavLink>
      <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>Ajustes</NavLink>
    </nav>
  );
}

export default BottomNav; 