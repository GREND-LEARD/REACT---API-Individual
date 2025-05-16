import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importar Contextos
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ScoreProvider } from './contexts/ScoreContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';

// Importar navegación
import BottomNav from './navigation/BottomNav';
import ScoreDisplay from './components/ScoreDisplay';

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Si está cargando, mostramos un indicador
  if (loading) return <div>Cargando...</div>;
  
  // Si no hay usuario, redirigimos a login
  if (!user) return <Navigate to="/login" />;
  
  // Si hay usuario, mostramos el contenido de la ruta
  return children;
};

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ScoreProvider>
          <div className="app-container"> {/* Contenedor principal */}
            <main className="content"> {/* Área para el contenido de la pantalla */}
              <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/" element={<HomeScreen />} />
                <Route path="/filter" element={<FilterScreen />} />
                <Route path="/search" element={<SearchScreen />} />
                <Route path="/favorites" element={
                  <PrivateRoute>
                    <FavoritesScreen />
                  </PrivateRoute>
                } />
                <Route path="/stats" element={
                  <PrivateRoute>
                    <StatsScreen />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <ProfileScreen />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={<SettingsScreen />} />
              </Routes>
            </main>
            <ScoreDisplay />
            <BottomNav /> {/* El menú de navegación siempre visible */}
          </div>
        </ScoreProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
