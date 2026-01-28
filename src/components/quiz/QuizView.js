
import React, { useEffect, useMemo, useState } from 'react';
import { Card, ListGroup, Button, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './QuizView.css';

function QuizView({ islandId }) {
  const navigate = useNavigate();

  // MOCK: preguntas por isla (puedes añadir más)
  const mockQuestionsByIsland = useMemo(
    () => ({
      'island-1': [
        {
          id: 'q1',
          questionText: '¿Quién le dio a Luffy su sombrero de paja?',
          optionA: 'Gol D. Roger',
          optionB: 'Shanks',
          optionC: 'Rayleigh',
          optionD: 'Ace',
          correctAnswer: 'Shanks',
        },
        {
          id: 'q2',
          questionText: '¿Qué fruta del diablo comió Luffy?',
          optionA: 'Mera Mera no Mi',
          optionB: 'Ope Ope no Mi',
          optionC: 'Gomu Gomu no Mi',
          optionD: 'Bara Bara no Mi',
          correctAnswer: 'Gomu Gomu no Mi',
        },
        {
          id: 'q3',
          questionText: '¿Quién fue la primera persona que Luffy reclutó?',
          optionA: 'Nami',
          optionB: 'Usopp',
          optionC: 'Roronoa Zoro',
          optionD: 'Sanji',
          correctAnswer: 'Roronoa Zoro',
        },
      ],
      'island-2': [
        {
          id: 'q1',
          questionText: '¿Cómo se llama el capitán con mandíbula de acero?',
          optionA: 'Smoker',
          optionB: 'Morgan',
          optionC: 'Garp',
          optionD: 'Koby',
          correctAnswer: 'Morgan',
        },
        {
          id: 'q2',
          questionText: '¿Dónde estaba la base de la Marina al inicio?',
          optionA: 'Marineford',
          optionB: 'Sucursal 153',
          optionC: 'G-5',
          optionD: 'Enies Lobby',
          correctAnswer: 'Sucursal 153',
        },
      ],
    }),
    []
  );

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);

    // Simula “fetch”
    const t = setTimeout(() => {
      const qs = mockQuestionsByIsland[islandId] || [];
      if (qs.length === 0) {
        setError('No hay preguntas para esta isla (mock).');
      } else {
        setQuestions(qs);
      }
      setLoading(false);
    }, 250);

    return () => clearTimeout(t);
  }, [islandId, mockQuestionsByIsland]);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer) return; // evita doble click

    setSelectedAnswer(answer);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      const isLast = currentQuestionIndex >= questions.length - 1;

      if (!isLast) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 900);
  };

  const handleBackToMap = () => {
    navigate('/mapa');
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

 if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="light" role="status">
          <span className="visually-hidden">Cargando preguntas...</span>
        </Spinner>
      </div>
    );
  }

  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(0);
    const passed = score >= questions.length * 0.6;

    return (
      <Card className="quiz-glass-card text-center animate__animated animate__fadeIn">
        <Card.Body className="p-5">
          <h2 className="text-white fw-bold">{passed ? '🎊 ¡Misión Cumplida!' : '☠️ ¡A pique!'}</h2>
          <div className="score-circle my-4">
            <h3 className="mb-0">{score}/{questions.length}</h3>
            <small>{percentage}%</small>
          </div>
          <p className="text-light fs-5">
            {passed ? 'Has conquistado esta isla.' : 'Tu barco necesita reparaciones. ¡Reinténtalo!'}
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="warning" className="fw-bold px-4" onClick={handleBackToMap}>Volver al Mapa</Button>
            <Button variant="outline-light" onClick={handleRetry}>Reintentar</Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-view-container">
      {/* Barra de progreso personalizada */}
      <div className="progress-container mb-4 mt-5">
        <div className="d-flex justify-content-between text-white mb-2 small fw-bold">
          <span>PROGRESO</span>
          <span>{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <ProgressBar now={progressPercentage} className="quiz-progress-bar" />
      </div>

      <Card className="quiz-glass-card border-0">
        <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3">
          <h5 className="text-white-50 mb-0">PREGUNTA {currentQuestionIndex + 1}</h5>
        </Card.Header>
        <Card.Body className="p-4 p-md-5">
          <Card.Title className="text-white fs-3 mb-5 text-center">
            {currentQuestion.questionText}
          </Card.Title>

          <div className="options-grid">
            {['optionA', 'optionB', 'optionC', 'optionD'].map((key) => {
              const optionValue = currentQuestion[key];
              const isSelected = selectedAnswer === optionValue;
              const isCorrect = optionValue === currentQuestion.correctAnswer;
              
              let statusClass = '';
              if (selectedAnswer) {
                if (isCorrect) statusClass = 'correct';
                else if (isSelected) statusClass = 'incorrect';
                else statusClass = 'dimmed';
              }

              return (
                <div 
                  key={key} 
                  className={`quiz-option ${statusClass}`}
                  onClick={() => handleAnswerClick(optionValue)}
                >
                  <span className="option-letter">{key.slice(-1)}</span>
                  {optionValue}
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
      
      <div className="text-center mt-4 text-white-50">
         Puntuación actual: <span className="text-warning fw-bold">{score}</span>
      </div>
    </div>
  );
}

export default QuizView;