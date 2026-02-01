import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente que protege rutas privadas de la aplicación.
 * Solo permite el acceso si el usuario está autenticado.
 */
function ProtectedRoute({ children }) {
  // Se obtiene el usuario y el estado de carga desde el context
  const { user, loading } = useAuth();

  // Mientras se comprueba la sesión, no se renderiza para evitar
  // redirecciones incorrectas.
  if (loading) return null;

  // Si ya terminó la comprobación y NO hay usuario autenticado,
  // redirigimos a Home (login/registro).
  // replace evita que el usuario vuelva a la ruta protegida con "atrás".
  if (!user) return <Navigate to="/" replace />;

  // Si hay usuario, se permite acceso y se renderiza el contenido protegido.
  return children;
}

export default ProtectedRoute;

