import React, { useEffect, useState } from 'react';
import { Card, Button, ProgressBar, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getQuestionsByIsland, submitScore, validateAnswer } from '../../services/quiz.api';
import { getCharacterImagePath, PLACEHOLDER_IMAGE, SAFE_FALLBACK_IMAGE } from '../../utils/imagePaths';
import './QuizView.css';

// Devuelve la variante Bootstrap para el badge según la rareza de la carta
const rarityVariant = (rarity) => {
  if (!rarity) return 'secondary';
  const r = rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (r === 'legendary' || r === 'legendaria') return 'warning';
  if (r === 'rare' || r === 'rara' || r === 'epica') return 'info';
  return 'secondary';
};

// Componente que gestiona el quiz de una isla concreta
function QuizView({ islandId }) {
  const navigate = useNavigate(); // Sirve para navegar a otras rutas (por ejemplo volver al mapa)

  // Estados principales del quiz
  const [questions, setQuestions] = useState([]); // Preguntas de la isla
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Índice de la pregunta actual
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Respuesta seleccionada por el usuario (para evitar doble click)
  const [isSelectedAnswerCorrect, setIsSelectedAnswerCorrect] = useState(null); // Guarda si la respuesta seleccionada fue correcta o no
  const [score, setScore] = useState(0); // Puntuación (nº de aciertos)
  const [showResult, setShowResult] = useState(false); // Si true, se muestra la pantalla final del resultado
  const [loading, setLoading] = useState(true); // Loading mientras se cargan preguntas
  const [error, setError] = useState(''); // Mensaje de error si algo falla
  const [newCard, setNewCard] = useState(null); // Carta obtenida al completar al 100% (null si no se obtuvo)

  // Cada vez que cambia el islandId: reiniciamos el quiz y cargamos preguntas nuevas
  useEffect(() => {
    let mounted = true; // Bandera para evitar setState si el componente se desmonta

    const loadQuestions = async () => { // Función para cargar preguntas desde el backend
      try {
        setLoading(true); // Activamos spinner
        setError(''); // Limpiamos error anterior
        setShowResult(false); // Quitamos resultado final si venimos de un intento anterior
        setCurrentQuestionIndex(0); // Volvemos a la pregunta 1
        setSelectedAnswer(null); // Limpiamos selección
        setIsSelectedAnswerCorrect(null); // Limpiamos estado de correcto/incorrecto
        setScore(0); // Puntuación a 0

        // Petición al backend para traer preguntas de la isla
        const questionsData = await getQuestionsByIsland(islandId);

        // Si no hay preguntas, lanzamos un error para mostrarlo en pantalla
        if (!questionsData || questionsData.length === 0) {
          throw new Error('No hay preguntas para esta isla.');
        }

        // Si el componente sigue montado, guardamos preguntas en el estado
        if (mounted) {
          setQuestions(questionsData);
        }
      } catch (err) {
        // Si hay error, guardamos mensaje y vaciamos preguntas
        if (mounted) {
          setError(err.response?.data?.message || err.message || 'No se pudieron cargar las preguntas.');
          setQuestions([]);
        }
      } finally {
        // Quitamos loading pase lo que pase
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadQuestions(); // Ejecuta la carga

    // Cleanup: si el componente se desmonta, evitamos actualizar estados
    return () => {
      mounted = false;
    };
  }, [islandId]);

  // Función que se ejecuta cuando el usuario hace click en una opción
  const handleAnswerClick = async (answer) => {
    if (selectedAnswer) return; // Evita doble click si ya seleccionó una respuesta

    const currentQuestion = questions[currentQuestionIndex]; // Pregunta actual
    if (!currentQuestion) return; // Seguridad por si no hay pregunta cargada

    try {
      // Llama al backend para validar si la respuesta es correcta
      const validation = await validateAnswer(currentQuestion.id, answer);
      const isCorrect = Boolean(validation?.isCorrect); // true/false según responda la API

      // Calcula la nueva puntuación (si acierta suma 1)
      const updatedScore = score + (isCorrect ? 1 : 0);

      // Guardamos selección y si fue correcta (para colorear opciones)
      setSelectedAnswer(answer);
      setIsSelectedAnswerCorrect(isCorrect);

      // Si es correcta, actualizamos score
      if (isCorrect) {
        setScore(updatedScore);
      }

      // Espera un poco para que el usuario vea el feedback (correct/incorrect)
      setTimeout(async () => {
        const isLast = currentQuestionIndex >= questions.length - 1; // Comprueba si es la última pregunta

        // Si NO es la última, pasa a la siguiente y resetea selección
        if (!isLast) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setIsSelectedAnswerCorrect(null);
          return;
        }

        // Si ES la última, intenta guardar puntuación en el backend
        try {
          const result = await submitScore(islandId, updatedScore);
          setNewCard(result?.newCard || null); // Guarda la carta si se obtuvo al 100%
        } catch (submitError) {
          console.error(submitError); // Si falla guardar, no rompemos el quiz (solo lo registramos)
        }

        // Muestra la pantalla final
        setShowResult(true);
      }, 900);
    } catch (err) {
      // Error al validar (ej: problema de red o pregunta no encontrada)
      setError(err.response?.data?.message || 'No se pudo validar la respuesta.');
    }
  };

  // Botón para volver al mapa
  const handleBackToMap = () => {
    navigate('/mapa');
  };

  // Botón para reintentar el quiz (reinicia estados)
  const handleRetry = () => {
    setLoading(true);
    setError('');
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSelectedAnswerCorrect(null);
    setScore(0);
    setNewCard(null); // Limpia la carta al reintentar
    setLoading(false); // (ojo: aquí solo resetea, no vuelve a pedir preguntas)
  };

  // Si está cargando, mostramos spinner
  if (loading) {
    return (
      <div className="quiz-view-container text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  // Si hay error, mostramos mensaje y botón para volver
  if (error) {
    return (
      <div className="quiz-view-container">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button variant="warning" onClick={handleBackToMap}>
            Volver al Mapa
          </Button>
        </div>
      </div>
    );
  }

  // Si showResult es true, mostramos el resultado final
  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(0); // % de aciertos
    const passed = score >= questions.length * 0.6; // Aprueba si acierta al menos el 60%

    return (
      <div className="quiz-view-container">
        <Card className="quiz-glass-card text-center animate__animated animate__fadeIn">
          <Card.Body className="p-5">
            <h2 className="text-white fw-bold">
              {passed ? ' ¡Misión Cumplida!' : '☠️ ¡A pique!'}
            </h2>

            {/* Círculo con la puntuación */}
            <div className="score-circle my-4">
              <h3 className="mb-0">{score}/{questions.length}</h3>
              <small>{percentage}%</small>
            </div>

            {/* Texto según aprobado o no */}
            <p className="text-light fs-5">
              {passed ? 'Has conquistado esta isla.' : 'Tu barco necesita reparaciones. ¡Reinténtalo!'}
            </p>

            {/* Carta obtenida al conseguir el 100% */}
            {newCard && (
              <div className="card-reward-section mt-4">
                <p className="text-warning fw-bold fs-5 mb-3">¡Has obtenido una carta de personaje!</p>
                <div className="card-flip-wrapper">
                  <div className={`character-card rarity-${rarityVariant(newCard.rarity)}`}>
                    <img
                      src={getCharacterImagePath(newCard.name)}
                      alt={newCard.name}
                      className="character-card-img"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const step = img.dataset.fallbackStep || '0';
                        // 1º intento: imageUrl de la API
                        if (step === '0') { img.dataset.fallbackStep = '1'; img.src = newCard.imageUrl; return; }
                        // 2º intento: placeholder genérico (luffy)
                        if (step === '1') { img.dataset.fallbackStep = '2'; img.src = PLACEHOLDER_IMAGE; return; }
                        // 3º intento: imagen de seguridad final (zoro)
                        img.onerror = null; img.src = SAFE_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="character-card-body">
                      <h5 className="text-white fw-bold mb-1">{newCard.name}</h5>
                      {newCard.title && <small className="text-white-50 d-block mb-2">{newCard.title}</small>}
                      <Badge bg={rarityVariant(newCard.rarity)} className="mb-2">{newCard.rarity}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje motivador si pasó pero no obtuvo carta (ya la tenía o puntuación < 100%) */}
            {passed && !newCard && score < questions.length && (
              <p className="text-white-50 small mt-3">
                Consigue el 100% para ganar la carta de esta isla
              </p>
            )}

            {/* Botones finales */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button variant="warning" className="fw-bold px-4" onClick={handleBackToMap}>
                Volver al Mapa
              </Button>
              <Button variant="outline-light" onClick={handleRetry}>
                Reintentar
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Si no es resultado final, mostramos la pregunta actual
  const currentQuestion = questions[currentQuestionIndex]; // Pregunta actual
  if (!currentQuestion) return null; // Seguridad por si no existe

  // Calcula el porcentaje de progreso para la barra (ej: pregunta 2 de 5)
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-view-container">
      {/* Barra de progreso arriba */}
      <div className="progress-container mb-4 mt-5">
        <div className="d-flex justify-content-between text-white mb-2 small fw-bold">
          <span>PROGRESO</span>
          <span>{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <ProgressBar now={progressPercentage} className="quiz-progress-bar" />
      </div>

      {/* Tarjeta principal del quiz */}
      <Card className="quiz-glass-card border-0">
        <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3">
          <h5 className="text-white-50 mb-0">PREGUNTA {currentQuestionIndex + 1}</h5>
        </Card.Header>

        <Card.Body className="p-4 p-md-5">
          {/* Texto de la pregunta */}
          <Card.Title className="text-white fs-3 mb-5 text-center">
            {currentQuestion.questionText}
          </Card.Title>

          {/* Opciones A, B, C, D */}
          <div className="options-grid">
            {['optionA', 'optionB', 'optionC', 'optionD'].map((key) => {
              const optionValue = currentQuestion[key]; // Texto de esa opción (A/B/C/D)
              const isSelected = selectedAnswer === optionValue; // Comprueba si esta opción es la seleccionada

              // Clases CSS según estado:
              // - si ha elegido: la elegida será correct/incorrect y las demás dimmed
              let statusClass = '';
              if (selectedAnswer) {
                if (isSelected) statusClass = isSelectedAnswerCorrect ? 'correct' : 'incorrect';
                else statusClass = 'dimmed';
              }

              return (
                <div
                  key={key}
                  className={`quiz-option ${statusClass}`} // Aplica clases para estilos visuales
                  onClick={() => handleAnswerClick(optionValue)} // Valida al hacer click
                >
                  {/* Muestra la letra (A/B/C/D) sacándola del nombre optionX */}
                  <span className="option-letter">{key.slice(-1)}</span>
                  {optionValue}
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Texto inferior con puntuación actual y pista de carta */}
      <div className="text-center mt-4 text-white-50">
        <div>Puntuación actual: <span className="text-warning fw-bold">{score}</span></div>
        <small className="text-white-50 mt-1 d-block">
          Responde todo bien para ganar la carta de esta isla
        </small>
      </div>
    </div>
  );
}

export default QuizView;