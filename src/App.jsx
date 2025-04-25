import { Routes, Route } from 'react-router-dom';
import './App.css';

// Importar Contextos
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ScoreProvider } from './contexts/ScoreContext';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Importar navegación
import BottomNav from './navigation/BottomNav';
import ScoreDisplay from './components/ScoreDisplay';

function App() {
  return (
    <FavoritesProvider>
      <ScoreProvider>
        <div className="app-container"> {/* Contenedor principal */}
          <main className="content"> {/* Área para el contenido de la pantalla */}
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/filter" element={<FilterScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/favorites" element={<FavoritesScreen />} />
              <Route path="/stats" element={<StatsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </main>
          <ScoreDisplay />
          <BottomNav /> {/* El menú de navegación siempre visible */}
        </div>
      </ScoreProvider>
    </FavoritesProvider>
  );
}

export default App;
