// Provisional:

import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import IslandNode from './IslandNode';
import './InteractiveMap.css';

function InteractiveMap() {
  const [islands, setIslands] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  // MOCK: islas
  const mockIslands = useMemo(
    () => [
      {
        id: 'island-1',
        name: 'Isla del Amanecer',
        description: 'El lugar donde todo comenzó.',
        position: 1,
        imageUrl: 'https://via.placeholder.com/600x400?text=Isla+1',
      },
      {
        id: 'island-2',
        name: 'Shells Town',
        description: 'Base de la Marina y comienzo del viaje.',
        position: 2,
        imageUrl: 'https://via.placeholder.com/600x400?text=Isla+2',
      },
      {
        id: 'island-3',
        name: 'Orange Town',
        description: 'Un payaso peligroso anda suelto…',
        position: 3,
        imageUrl: 'https://via.placeholder.com/600x400?text=Isla+3',
      },
      {
        id: 'island-4',
        name: 'Villa Syrup',
        description: 'Mentiras, valor… y un tirador.',
        position: 4,
        imageUrl: 'https://via.placeholder.com/600x400?text=Isla+4',
      },
    ],
    []
  );

  // MOCK: progreso del usuario (simula que completó la isla 1)
  const mockProgress = useMemo(
    () => [
      {
        id: 'progress-1',
        islandId: 'island-1',
        completed: true,
        score: 7,
        attempts: 1,
      },
    ],
    []
  );

  useEffect(() => {
    // Simula carga
    const t = setTimeout(() => {
      try {
        setIslands(mockIslands);
        setProgress(mockProgress);
      } catch (e) {
        // por si acaso
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [mockIslands, mockProgress]);

  // Calcular estado de una isla (completed / available / locked)
  const getIslandStatus = (island) => {
    const islandProgress = progress.find((p) => p.islandId === island.id);

    if (islandProgress?.completed) return 'completed';

    if (island.position === 1) return 'available';

    const previousIsland = islands.find((i) => i.position === island.position - 1);
    const previousProgress = progress.find((p) => p.islandId === previousIsland?.id);

    if (previousProgress?.completed) return 'available';

    return 'locked';
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="map-container mt-4">
      <h2 className="text-center mb-4">Tu Viaje</h2>
      <Row className="justify-content-center">
        {islands.map((island) => (
          <Col key={island.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <IslandNode island={island} status={getIslandStatus(island)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default InteractiveMap;