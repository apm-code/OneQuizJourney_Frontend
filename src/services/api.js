import axios from 'axios';

// Creamos una instancia del cliente HTTP Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL del backend
  withCredentials: true, // MUY IMPORTANTE para JWT de autenticación con cookies
});

export default api;

