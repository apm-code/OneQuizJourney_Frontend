import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// Se crea el contexto, el estado de los datos de la autenticación global
const AuthContext = createContext(null);

// Función para consumir el contexto de cada componente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // user será el usuario logueado (objeto) o null si no hay sesión.
  const [user, setUser] = useState(null);
  // loading controla si todavía estamos comprobando si existe sesión activa.
  const [loading, setLoading] = useState(true);

  // Al cargar la app: comprobar si hay sesión (cookie JWT válida).
  // Esto permite no perder el login si se refresca el navegador.
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Si el backend devuelve el usuario, significa que la cookie JWT es válida.
        const { data } = await api.get('/auth/profile');
        setUser(data);
      } catch (error) {
        // Si falla, no hay sesión válida
        setUser(null);
      } finally {
        // Se termina la comprobación
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Función login: llama al backend, y guarda el usuario en memoria (estado).
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    return response;
  };

  // Función logout: intenta cerrar sesión en backend y limpia el estado local.
  const logout = async () => {
    try {
      // El backend debe limpiar la cookie JWT (Set-Cookie expirando).
      await api.post('/auth/logout');
    } catch (err) {
      // Backend caído / sin conexión → no pasa nada, se limpia el estado.
    } finally {
      // SIEMPRE: limpiar sesión local
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // - - - - - - - - - - - - - - - - - - - - -
  // Función de acceso ficticio para pruebas sin backend
  // Eliminar tras unir el front con el back
  const devLogin = () => {
    // SOLO para desarrollo (mock)
    setUser({
      id: 'dev-user',
      username: 'Adri',
      email: 'adri@dev.local',
      berries: 0,
    });
  };
  // Valores que se exponen al resto de la aplicación
  const value = { user, loading, login, logout, devLogin };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};