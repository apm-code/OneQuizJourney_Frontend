import api from './api'; // Importa la instancia personalizada de Axios (con baseURL y withCredentials)

// Obtiene todas las islas disponibles
export const getIslands = async () => {
  // Hace GET a /quiz/islands
  const { data } = await api.get('/quiz/islands');
  return data; // Devuelve solo los datos (no la respuesta completa de Axios)
};

// Obtiene el progreso del usuario autenticado
export const getProgress = async () => {
  // Ruta protegida (requiere cookie JWT válida)
  const { data } = await api.get('/quiz/progress');
  return data;
};

// Obtiene el ranking completo (privado o interno del sistema)
export const getRanking = async () => {
  const { data } = await api.get('/quiz/ranking');
  return data;
};

// Obtiene el ranking público (ruta de Auth)
export const getPublicRanking = async () => {
  const { data } = await api.get('/auth/public-ranking');
  return data;
};

// Obtiene las preguntas de una isla concreta
export const getQuestionsByIsland = async (islandId) => {
  // islandId viene de la URL (ej: /quiz/3)
  const { data } = await api.get(`/quiz/islands/${islandId}/questions`);
  return data;
};

// Valida si la respuesta seleccionada es correcta
export const validateAnswer = async (questionId, selectedAnswer) => {
  // Se envía la respuesta seleccionada en el body
  const { data } = await api.post(
    `/quiz/questions/${questionId}/answer`,
    { selectedAnswer }
  );
  return data;
};

// Envía la puntuación final al backend
export const submitScore = async (islandId, score) => {
  const { data } = await api.post(
    `/quiz/islands/${islandId}/score`,
    { score }
  );
  return data;
};

// Obtiene las cartas de personaje que posee el usuario autenticado
export const getMyCards = async () => {
  const { data } = await api.get('/quiz/my-cards');
  return data;
};