import axios from 'axios';

// Creamos una instancia personalizada de Axios (cliente HTTP)
// Así no tenemos que repetir configuración en cada petición
const api = axios.create({
  // URL base del backend
  // Si existe la variable de entorno REACT_APP_API_URL la usa,
  // si no, usa por defecto localhost en desarrollo
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',

  // Permite que el navegador envíe cookies automáticamente
  // Esto es necesario porque usamos JWT en cookie httpOnly
  withCredentials: true,
});

export default api;