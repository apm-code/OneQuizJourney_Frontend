/*
Lo de la guía:

import React from 'react';
import { useParams } from 'react-router-dom';

function QuizPage() {
  const { islandId } = useParams();

  return (
    <div style={{ padding: 16 }}>
      <h1>QuizPage</h1>
      <p>IslandId: {islandId}</p>
      <p>Aquí irá el QuizView.</p>
    </div>
  );
}

export default QuizPage;
*/

// Provisional:

import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import QuizView from '../components/quiz/QuizView';

function QuizPage() {
  const { islandId } = useParams();

  return (
    <Container className="mt-4">
      <QuizView islandId={islandId} />
    </Container>
  );
}

export default QuizPage;