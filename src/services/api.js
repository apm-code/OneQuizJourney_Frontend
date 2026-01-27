import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // MUY IMPORTANTE para JWT en cookies
});

export default api;