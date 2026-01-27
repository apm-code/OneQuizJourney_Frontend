
/*
Lo de la guía:

import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ProfilePage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/quiz/progress');
        setProgress(response.data);
      } catch (err) {
        setError('Error al cargar el progreso.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
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

  const completedIslands = progress.filter((p) => p.completed).length;
  const totalScore = progress.reduce((acc, p) => acc + p.score, 0);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Mi Perfil</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <img
                src={user?.avatarUrl || 'https://via.placeholder.com/150'}
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h4>{user?.username}</h4>
              <p className="text-muted">{user?.email}</p>
            </Col>
            <Col md={8}>
              <h5 className="mb-3">Estadísticas</h5>
              <Row>
                <Col sm={6} className="mb-3">
                  <Card bg="primary" text="white">
                    <Card.Body>
                      <Card.Title>Islas Completadas</Card.Title>
                      <h2>{completedIslands}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} className="mb-3">
                  <Card bg="success" text="white">
                    <Card.Body>
                      <Card.Title>Puntuación Total</Card.Title>
                      <h2>{totalScore}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} className="mb-3">
                  <Card bg="warning" text="white">
                    <Card.Body>
                      <Card.Title>Berries</Card.Title>
                      <h2>{user?.berries || 0}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} className="mb-3">
                  <Card bg="info" text="white">
                    <Card.Body>
                      <Card.Title>Intentos Totales</Card.Title>
                      <h2>{progress.reduce((acc, p) => acc + p.attempts, 0)}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5>Progreso por Isla</h5>
        </Card.Header>
        <Card.Body>
          {progress.length === 0 ? (
            <p className="text-muted">Aún no has comenzado ninguna isla.</p>
          ) : (
            <Row>
              {progress.map((p) => (
                <Col key={p.id} md={6} lg={4} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{p.island.name}</Card.Title>
                      <p>
                        <Badge bg={p.completed ? 'success' : 'secondary'}>
                          {p.completed ? 'Completada' : 'En progreso'}
                        </Badge>
                      </p>
                      <p>Puntuación: {p.score}</p>
                      <p>Intentos: {p.attempts}</p>
                      {p.completedAt && (
                        <p className="text-muted">
                          <small>
                            Completada: {new Date(p.completedAt).toLocaleDateString()}
                          </small>
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfilePage;
*/
// Provisional:

import React from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user } = useAuth();

  // MOCK de progreso
  const progress = [
    { id: 'p1', islandName: 'Isla del Amanecer', completed: true, score: 7, attempts: 1 },
    { id: 'p2', islandName: 'Shells Town', completed: false, score: 1, attempts: 2 },
  ];

  const completedIslands = progress.filter((p) => p.completed).length;
  const totalScore = progress.reduce((acc, p) => acc + p.score, 0);
  const totalAttempts = progress.reduce((acc, p) => acc + p.attempts, 0);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Mi Perfil (mock)</h2>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <img
                src={'https://via.placeholder.com/150'}
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{ width: 150, height: 150, objectFit: 'cover' }}
              />
              <h4>{user?.username}</h4>
              <p className="text-muted">{user?.email}</p>
            </Col>

            <Col md={8}>
              <h5 className="mb-3">Estadísticas</h5>
              <Row>
                <Col sm={6} className="mb-3">
                  <Card bg="primary" text="white">
                    <Card.Body>
                      <Card.Title>Islas Completadas</Card.Title>
                      <h2>{completedIslands}</h2>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={6} className="mb-3">
                  <Card bg="success" text="white">
                    <Card.Body>
                      <Card.Title>Puntuación Total</Card.Title>
                      <h2>{totalScore}</h2>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={6} className="mb-3">
                  <Card bg="warning" text="white">
                    <Card.Body>
                      <Card.Title>Berries</Card.Title>
                      <h2>{user?.berries ?? 0}</h2>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={6} className="mb-3">
                  <Card bg="info" text="white">
                    <Card.Body>
                      <Card.Title>Intentos Totales</Card.Title>
                      <h2>{totalAttempts}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5>Progreso por Isla (mock)</h5>
        </Card.Header>
        <Card.Body>
          {progress.map((p) => (
            <Card key={p.id} className="mb-2">
              <Card.Body>
                <Card.Title className="mb-2">{p.islandName}</Card.Title>
                <p className="mb-1">
                  <Badge bg={p.completed ? 'success' : 'secondary'}>
                    {p.completed ? 'Completada' : 'En progreso'}
                  </Badge>
                </p>
                <p className="mb-1">Puntuación: {p.score}</p>
                <p className="mb-0">Intentos: {p.attempts}</p>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfilePage;