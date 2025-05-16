import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './BottomNav.css';
// Importar iconos
import { FaHome, FaFilter, FaSearch, FaStar, FaChartBar, FaUser } from 'react-icons/fa';

function BottomNav() {
  const { user } = useAuth();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FaHome className="nav-icon" />
        <span className="nav-text">Inicio</span>
      </NavLink>
      
      <NavLink to="/filter" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FaFilter className="nav-icon" />
        <span className="nav-text">Filtro</span>
      </NavLink>
      
      <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FaSearch className="nav-icon" />
        <span className="nav-text">Buscar</span>
      </NavLink>
      
      <NavLink to="/favorites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FaStar className="nav-icon" />
        <span className="nav-text">Favoritos</span>
      </NavLink>
      
      <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FaChartBar className="nav-icon" />
        <span className="nav-text">Estadísticas</span>
      </NavLink>
      
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FaUser className="nav-icon" />
        <span className="nav-text">{user ? 'Perfil' : 'Acceder'}</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav; 