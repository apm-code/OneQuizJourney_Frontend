

import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import QuizView from '../components/quiz/QuizView';
import './QuizPage.css'; // Crearemos este archivo para el fondo

function QuizPage() {
  const { islandId } = useParams();

  return (
    <div className="quiz-page-bg">
      <div className="quiz-content-wrapper">
        <Container className="py-5">
          <QuizView islandId={islandId} />
        </Container>
      </div>
    </div>
  );
}

export default QuizPage;