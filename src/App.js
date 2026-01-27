/*
Lo de la guía:

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import RankingPage from './pages/RankingPage';

import Navbar from './components/common/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/quiz/:islandId" element={<QuizPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
*/

// Provisional:
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import RankingPage from './pages/RankingPage';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/mapa"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:islandId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ranking"
            element={
              <ProtectedRoute>
                <RankingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;