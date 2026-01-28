import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './IslandNode.css';

function IslandNode({ island, status }) {
  const isLocked = status === 'locked';

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <span className="badge-glass bg-gold">★ Completada</span>;
      case 'available':
        return <span className="badge-glass bg-blue">⛵ Disponible</span>;
      case 'locked':
        return <span className="badge-glass bg-gray">🔒 Bloqueada</span>;
      default:
        return null;
    }
  };

  const cardContent = (
    <Card className={`island-glass-card ${status}`}>
      <div className="img-container">
        <Card.Img variant="top" src={island.imageUrl} alt={island.name} />
        <div className="status-overlay">{getStatusBadge()}</div>
      </div>
      <Card.Body className="text-white">
        <Card.Title className="fw-bold">{island.name}</Card.Title>
        <Card.Text className="small opacity-75">{island.description}</Card.Text>
        
        {isLocked && (
          <div className="locked-info mt-2">
            <small>Completa la isla anterior para desbloquear</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  if (!isLocked) {
    return (
      <Link to={`/quiz/${island.id}`} className="text-decoration-none">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default IslandNode;