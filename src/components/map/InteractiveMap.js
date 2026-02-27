import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import IslandNode from './IslandNode';
import './InteractiveMap.css';
import api from '../../services/api';

function InteractiveMap() {
  // Estados principales del componente
  const [islands, setIslands] = useState([]);   // Lista de islas que se van a mostrar en el mapa
  const [progress, setProgress] = useState([]); // Progreso del usuario (qué islas tiene completadas, puntuación, etc.)
  const [loading, setLoading] = useState(true); // Indica si estamos cargando datos (islas o progreso)
  const [error, setError] = useState('');       // Guarda un mensaje de error si falla la carga

  // useEffect: se ejecuta una vez cuando se monta el componente (cuando se abre la pantalla)
  useEffect(() => {
    const loadMapData = async () => { // Función para cargar los datos necesarios del mapa
      try {
        setLoading(true); // Activa la carga
        setError(''); // Limpia errores anteriores

        // Se piden islas y progreso a la vez para ir más rápido
        // getIslands() y getProgress() deberían ser funciones que llamen a tu API
        const [islandsRes, progressRes] = await Promise.all([
          api.get('/quiz/islands'),
          api.get('/quiz/progress'),
        ]);

        // Por seguridad se comprueba que lo recibido es un array
        setIslands(Array.isArray(islandsRes.data) ? islandsRes.data : []);
        setProgress(Array.isArray(progressRes.data) ? progressRes.data : []);

      } catch (e) {
        // Si falla, mostramos el mensaje del backend si existe, o uno genérico
        setError(e.response?.data?.message || 'No se pudo cargar el mapa.');
      } finally {
        setLoading(false); // Quitamos el loading pase lo que pase (éxito o error)
      }
    };

    loadMapData(); // Ejecuta la carga al entrar en la pantalla
  }, []);

  // Función que calcula el estado de cada isla:
  // - completed: ya completada
  // - available: se puede jugar (desbloqueada)
  // - locked: bloqueada
  const getIslandStatus = (island) => {
    // Busca si hay progreso para esa isla
    const islandProgress = progress.find((p) => p.islandId === island.id);

    // Si el usuario ya completó esa isla, estado "completed"
    if (islandProgress?.completed)
      return 'completed';

    // La primera isla siempre está disponible para empezar
    if (island.position === 1)
      return 'available';

    // Si la isla anterior está completada, la actual se desbloquea
    const previousIsland = islands.find((i) => i.position === island.position - 1);
    const previousProgress = progress.find((p) => p.islandId === previousIsland?.id);

    if (previousProgress?.completed)
      return 'available';

    // Si no cumple nada de lo anterior, queda bloqueada
    return 'locked';
  };

  // Si está cargando, mostramos el spinner
  if (loading) {
    return (
      <Container className="map-content py-5 text-center">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  // Si hay error, mostramos alerta
  if (error) {
    return (
      <Container className="map-content py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Si todo va bien, pintamos el mapa con las islas
  return (
    <Container className="map-content py-5">

      {/* Título del mapa */}
      <h2 className="text-center mb-5 fw-bold text-white title-shadow mt-5">
        ¡Hora de viajar!
      </h2>

      {/* Grid de islas */}
      <Row className="justify-content-center">
        {islands.map((island) => (
          <Col key={island.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            {/* IslandNode recibe la isla y su estado (locked/available/completed) */}
            <IslandNode island={island} status={getIslandStatus(island)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default InteractiveMap;