

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
        imageUrl: 'https://i.pinimg.com/originals/28/19/45/281945e347ded39b4f77cdc33cd98fca.jpg',
      },
      {
        id: 'island-2',
        name: 'Wano',
        description: 'Un país samurái lleno de misterios.',
        position: 2,
        imageUrl: 'https://i.pinimg.com/736x/43/eb/18/43eb18dbf73bf8e5a940e363e2d4253b.jpg',
      },
      {
        id: 'island-3',
        name: 'Elbaf',
        description: 'Tierra de gigantes y leyendas.',
        position: 3,
        imageUrl: 'https://i.pinimg.com/736x/39/33/68/3933684eeebddd5dc02e307b31dcf9d7.jpg',
      },
      {
        id: 'island-4',
        name: 'Water 7',
        description: 'Ciudad de los carpinteros y los canales.',
        position: 4,
        imageUrl: 'https://i.pinimg.com/736x/16/f3/dd/16f3dd225012310cde7639af3d196095.jpg',
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
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="map-content py-5">
      
      <h2 className="text-center mb-5 fw-bold text-white title-shadow mt-5">
        ¡Hora de viajar!
      </h2>
      
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