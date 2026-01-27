/*
Lo de la guía:
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './QuizView.css';

function QuizView({ islandId }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/quiz/islands/${islandId}/questions`);
        setQuestions(response.data);
      } catch (err) {
        setError('Error al cargar las preguntas. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [islandId]);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer) return; // Prevenir múltiples clics

    setSelectedAnswer(answer);

    // Verificar si la respuesta es correcta
    // Nota: En un entorno real, esta verificación debería hacerse en el backend
    // Aquí asumimos que podemos verificar comparando con las opciones
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    // Avanzar a la siguiente pregunta después de un breve delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const finishQuiz = async (finalScore) => {
    try {
      await api.post(`/quiz/islands/${islandId}/score`, {
        score: finalScore,
      });
      setShowResult(true);
    } catch (err) {
      setError('Error al guardar la puntuación.');
      console.error(err);
    }
  };

  const handleBackToMap = () => {
    navigate('/mapa');
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando preguntas...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(0);
    const passed = score >= questions.length * 0.6;

    return (
      <Card className="quiz-result-card">
        <Card.Body className="text-center">
          <h2>{passed ? '¡Felicidades!' : '¡Buen intento!'}</h2>
          <h3 className="mt-4">
            Puntuación: {score}/{questions.length} ({percentage}%)
          </h3>
          <p className="mt-3">
            {passed
              ? '¡Has completado esta isla! Ahora puedes avanzar a la siguiente.'
              : 'Necesitas al menos 60% para completar la isla. ¡Inténtalo de nuevo!'}
          </p>
          <Button variant="primary" size="lg" onClick={handleBackToMap} className="mt-4">
            Volver al Mapa
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const getAnswerClass = (option) => {
    if (!selectedAnswer) return '';
    
    // Nota: Esta lógica asume que tenemos acceso a correctAnswer en el frontend
    // En producción, esto debería manejarse diferente por seguridad
    if (option === currentQuestion.correctAnswer) {
      return 'list-group-item-success';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'list-group-item-danger';
    }
    return '';
  };

  return (
    <div className="quiz-container">
      <ProgressBar now={progress} label={`${currentQuestionIndex + 1}/${questions.length}`} className="mb-4" />
      
      <Card>
        <Card.Header>
          <h4>Pregunta {currentQuestionIndex + 1}</h4>
        </Card.Header>
        <Card.Body>
          <Card.Title className="mb-4">{currentQuestion.questionText}</Card.Title>
          <ListGroup>
            {['optionA', 'optionB', 'optionC', 'optionD'].map((optionKey) => (
              <ListGroup.Item
                key={optionKey}
                action
                onClick={() => handleAnswerClick(currentQuestion[optionKey])}
                className={getAnswerClass(currentQuestion[optionKey])}
                disabled={selectedAnswer !== null}
              >
                {currentQuestion[optionKey]}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      
      <div className="text-center mt-3">
        <p>Puntuación actual: {score}</p>
      </div>
    </div>
  );
}

export default QuizView;

*/

// Provisional:

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
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando preguntas...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(0);
    const passed = score >= questions.length * 0.6;

    return (
      <Card className="quiz-result-card">
        <Card.Body className="text-center">
          <h2>{passed ? '¡Felicidades!' : '¡Buen intento!'}</h2>
          <h3 className="mt-4">
            Puntuación: {score}/{questions.length} ({percentage}%)
          </h3>
          <p className="mt-3">
            {passed
              ? 'Has completado la isla (mock).'
              : 'Necesitas al menos 60% para completarla (mock).'}
          </p>

          <div className="d-flex justify-content-center gap-2 mt-4">
            <Button variant="primary" onClick={handleBackToMap}>
              Volver al Mapa
            </Button>
            <Button variant="outline-secondary" onClick={handleRetry}>
              Reintentar
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const getAnswerClass = (option) => {
    if (!selectedAnswer) return '';
    if (option === currentQuestion.correctAnswer) return 'list-group-item-success';
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return 'list-group-item-danger';
    return '';
  };

  return (
    <div className="quiz-container">
      <ProgressBar
        now={progress}
        label={`${currentQuestionIndex + 1}/${questions.length}`}
        className="mb-4"
      />

      <Card>
        <Card.Header>
          <h4>Pregunta {currentQuestionIndex + 1}</h4>
        </Card.Header>
        <Card.Body>
          <Card.Title className="mb-4">{currentQuestion.questionText}</Card.Title>

          <ListGroup>
            {['optionA', 'optionB', 'optionC', 'optionD'].map((key) => (
              <ListGroup.Item
                key={key}
                action
                onClick={() => handleAnswerClick(currentQuestion[key])}
                className={getAnswerClass(currentQuestion[key])}
                disabled={selectedAnswer !== null}
              >
                {currentQuestion[key]}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <div className="text-center mt-3">
        <p>Puntuación actual: {score}</p>
      </div>
    </div>
  );
}

export default QuizView;