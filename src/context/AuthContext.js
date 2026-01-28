import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app: comprobar si hay sesión (cookie token válida)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    return response;
  };



  /*
  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };
  */

  const logout = async () => {
    try {
      await api.post('/auth/logout'); // o el endpoint que tengáis
    } catch (err) {
      // Backend caído / sin conexión → no pasa nada
    } finally {
      // SIEMPRE: limpiar sesión local
      setUser(null);
      localStorage.removeItem('token'); // si guardas token
      localStorage.removeItem('user');  // si guardas user
    }
  };

  // - - - - - - - - - - - - - - - - - - - - -
  // Eliminar tras unir el front con el back:
  const devLogin = () => {
    // SOLO para desarrollo (mock)
    setUser({
      id: 'dev-user',
      username: 'Adri',
      email: 'adri@dev.local',
      berries: 0,
    });
  };
  // Eliminar también el devLogin de abajo
  // - - - - - - - - - - - - - - - - - - - - -

  const value = { user, loading, login, logout, devLogin };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};