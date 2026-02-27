import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './IslandNode.css';
import { getIslandImagePath, PLACEHOLDER_IMAGE, SAFE_FALLBACK_IMAGE } from '../../utils/imagePaths';

function IslandNode({ island, status }) {
  // Comprueba si la isla está bloqueada
  const isLocked = status === 'locked';

  // Si la isla tiene imageUrl la usa, si no intenta generar la ruta automáticamente
  const islandImage = island.imageUrl || getIslandImagePath(island.name);

  // Función que devuelve la etiqueta visual según el estado
  const getStatusBadge = () => {
    const baseClass = "badge-glass d-inline-flex align-items-center gap-1";

    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClass} bg-gold`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
              <path d="M480-80 360-240l-200-40 140-160-20-200 200 80 200-80-20 200 140 160-200 40L480-80Z" />
            </svg>
            Completada
          </span>
        );

      case 'available':
        return (
          <span className={`${baseClass} bg-blue`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
              <path d="M200-160q-33 0-56.5-23.5T120-240v-80h720v80q0 33-23.5 56.5T760-160H200Zm-80-240v-80h720v80H120Zm160-240 200-240 200 240H280Z" />
            </svg>
            Disponible
          </span>
        );

      case 'locked':
        return (
          <span className={`${baseClass} bg-gray`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
              <path d="M240-400h480v-200q0-100-70-170t-170-70q-100 0-170 70t-70 170v200Zm240 320q-33 0-56.5-23.5T400-160v-240H240v-80h480v80H560v240q0 33-23.5 56.5T480-80Z" />
            </svg>
            Bloqueada
          </span>
        );

      default:
        return null;
    }
  };

  // Contenido principal de la tarjeta
  const cardContent = (
    <Card className={`island-glass-card ${status}`}>

      {/* Contenedor de la imagen */}
      <div className="img-container">
        <Card.Img
          variant="top"
          src={islandImage} // Imagen principal
          alt={island.name}

          // Si falla la imagen, intenta usar imágenes alternativas (fallback)
          onError={(e) => {
            const img = e.currentTarget;
            const step = img.dataset.fallbackStep || '0';

            // Primer intento: usar imagen placeholder
            if (step === '0') {
              img.dataset.fallbackStep = '1';
              img.src = PLACEHOLDER_IMAGE;
              return;
            }

            // Segundo intento: usar imagen segura final
            img.onerror = null; // Evita bucle infinito de error
            img.src = SAFE_FALLBACK_IMAGE;
          }}
        />

        {/* Badge con el estado de la isla */}
        <div className="status-overlay">
          {getStatusBadge()}
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <Card.Body className="text-white">
        <Card.Title className="fw-bold">
          {island.name}
        </Card.Title>

        <Card.Text className="small opacity-75">
          {island.description}
        </Card.Text>

        {/* Si está bloqueada, se mustra mensaje adicional */}
        {isLocked && (
          <div className="locked-info mt-2">
            <small>Completa la isla anterior para desbloquear</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  // Si NO está bloqueada, la tarjeta es clicable y lleva al quiz
  if (!isLocked) {
    return (
      <Link to={`/quiz/${island.id}`} className="text-decoration-none">
        {cardContent}
      </Link>
    );
  }

  // Si está bloqueada, solo se muestra la tarjeta sin enlace
  return cardContent;
}

export default IslandNode;