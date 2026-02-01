
import React from 'react';
// React Router: Router envuelve toda la app para habilitar navegación SPA.
// Routes contiene el conjunto de rutas y Route define cada ruta individual.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Proveedor de autenticación: expone el contexto (user, loading, login, logout, etc.)
// a todos los componentes que estén dentro.
import { AuthProvider } from './context/AuthContext';

// Páginas principales
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import RankingPage from './pages/RankingPage';

// Componentes comunes
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer'; // Actualmente, no está en toda la página

// Componente que protege rutas privadas y verifica si el usuario está autenticado
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    // Router habilita la navegación sin recargar la página (SPA)
    <Router>
      {/* AuthProvider hace que toda la app tenga acceso a la autenticación */}
      <AuthProvider>
        {/* Navbar se muestra en todas las páginas (siempre visible) */}
        <Navbar />
        {/* Routes agrupa todas las rutas definidas */}
        <Routes>
          {/* Ruta pública: accesible sin iniciar sesión */}
          <Route path="/" element={<HomePage />} />

          {/* Ruta protegida: solo accesible si user existe */}
          <Route path="/mapa" element={ <ProtectedRoute> <MapPage /> </ProtectedRoute>}/>

          {/* Ruta protegida con parámetro dinámico :islandId */}
          <Route path="/quiz/:islandId" element={ <ProtectedRoute> <QuizPage /> </ProtectedRoute>} />

          {/* Ruta protegida: perfil del usuario */}
          <Route path="/perfil" element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
          
          {/* Ruta protegida: ranking global */}
          <Route path="/ranking" element={ <ProtectedRoute> <RankingPage /> </ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;