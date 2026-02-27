import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// Se crea el contexto de autenticación (para compartir la sesión en toda la app)
const AuthContext = createContext(null);

// Hook personalizado para consumir el contexto desde cualquier componente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // user guarda el usuario logueado (objeto) o null si no hay sesión
  const [user, setUser] = useState(null);

  // loading indica si todavía estamos comprobando si hay sesión activa
  const [loading, setLoading] = useState(true);

  // Función para pedir al backend el perfil del usuario (si la cookie JWT es válida)
  // Esto sirve para no perder el login al recargar la página
  const refreshProfile = async () => {
    const { data } = await api.get('/auth/profile'); // GET protegido: si hay cookie válida, devuelve el usuario
    setUser(data); // Guardamos usuario en el estado global
    return data; // Devolvemos datos por si algún componente quiere usarlos
  };

  // useEffect: se ejecuta al arrancar la app para comprobar si el usuario ya estaba logueado
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Si el backend devuelve usuario, significa que hay sesión (cookie válida)
        await refreshProfile();
      } catch (error) {
        // Si falla (401 normalmente), no hay sesión válida
        setUser(null);
      } finally {
        // Terminamos la comprobación inicial
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Función login: hace POST al backend y guarda el usuario en el estado
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password }); // El backend crea cookie httpOnly con el token
    setUser(response.data.user); // Guardamos el usuario devuelto por el backend
    return response; // Devolvemos la respuesta por si se necesita en el componente
  };

  // Función logout: pide al backend cerrar sesión y limpia el estado local
  const logout = async () => {
    try {
      // El backend debería borrar la cookie JWT (clearCookie)
      await api.post('/auth/logout');
    } catch (err) {
      // Si falla la petición (backend caído), igualmente limpiamos el estado en el front
    } finally {
      // SIEMPRE: limpiar sesión en el front
      setUser(null);

      // Limpieza extra (por si en algún momento guardaste cosas en localStorage)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Objeto con lo que compartimos a toda la app (lo que podrán usar los componentes)
  const value = { user, loading, login, logout, refreshProfile };

  return (
    <AuthContext.Provider value={value}>
      {/* Solo renderizamos la app cuando termina de comprobar si hay sesión */}
      {!loading && children}
    </AuthContext.Provider>
  );
};