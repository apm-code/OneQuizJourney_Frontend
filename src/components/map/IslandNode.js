// Provisional:

import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './IslandNode.css';

function IslandNode({ island, status }) {
  const getStatusClass = () => {
    switch (status) {
      case 'completed':
        return 'island-completed';
      case 'available':
        return 'island-available';
      case 'locked':
        return 'island-locked';
      default:
        return '';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <span className="badge bg-success">Completada</span>;
      case 'available':
        return <span className="badge bg-primary">Disponible</span>;
      case 'locked':
        return <span className="badge bg-secondary">Bloqueada</span>;
      default:
        return null;
    }
  };

  const cardContent = (
    <Card className={`island-card ${getStatusClass()}`}>
      <Card.Img variant="top" src={island.imageUrl} alt={island.name} />
      <Card.Body>
        <Card.Title>{island.name}</Card.Title>
        <Card.Text>{island.description}</Card.Text>
        {getStatusBadge()}
        {status === 'locked' && (
          <Card.Text className="text-muted mt-2">
            <small>Completa la isla anterior para desbloquear</small>
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );

  if (status === 'available' || status === 'completed') {
    return (
      <Link to={`/quiz/${island.id}`} className="text-decoration-none">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default IslandNode;