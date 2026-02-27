import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import QuizView from '../components/quiz/QuizView';
import './QuizPage.css';

// Página que envuelve el componente QuizView
function QuizPage() {
  // useParams permite obtener parámetros dinámicos de la URL
  // Ejemplo de ruta: /quiz/3  → islandId = "3"
  const { islandId } = useParams();

  return (
    // Contenedor principal con fondo específico del quiz
    <div className="quiz-page-bg">
      
      {/* Wrapper para centrar o limitar el contenido */}
      <div className="quiz-content-wrapper">
        
        {/* Container de Bootstrap para aplicar márgenes y padding */}
        <Container className="py-5">
          
          {/* Componente que contiene toda la lógica del quiz */}
          {/* Le pasamos islandId como prop */}
          <QuizView islandId={islandId} />
        
        </Container>
      </div>
    </div>
  );
}

export default QuizPage;