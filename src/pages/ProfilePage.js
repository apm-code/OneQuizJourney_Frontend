import React from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const { user } = useAuth();

  const progress = [
    { id: 'p1', islandName: 'Isla del Amanecer', completed: true, score: 7, attempts: 1 },
    { id: 'p2', islandName: 'Shells Town', completed: false, score: 1, attempts: 2 },
  ];

  const completedIslands = progress.filter((p) => p.completed).length;
  const totalScore = progress.reduce((acc, p) => acc + p.score, 0);
  const totalAttempts = progress.reduce((acc, p) => acc + p.attempts, 0);

  return (
    <div className="profile-page-bg">
      <Container className="py-5">
        <h2 className="text-white fw-bold mb-4 title-shadow">Bitácora de Viaje</h2>

        {/* Tarjeta de Perfil Principal */}
        <Card className="profile-glass-card mb-4 border-0">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={4} className="text-center mb-4 mb-md-0">
                <div className="avatar-wrapper shadow-lg mb-3">
                  <img
                    src={'https://bordadosrecio.com/cdn/shop/products/luffypeloblanco.png?v=1676170348' + user?.username}
                    alt="Avatar"
                    className="avatar-img" width={200} height={200}
                  />
                </div>
                <h3 className="text-white fw-bold">{user?.username || 'Pirata'}</h3>
                <p className="text-warning mb-0">Rango: Supernova</p>
              </Col>

              <Col md={8}>
                <h5 className="text-white opacity-75 mb-4">Estadísticas de Navegación</h5>
                <Row className="g-3">
                  {[
                    { title: 'Islas', value: completedIslands, color: 'blue' },
                    { title: 'Puntos', value: totalScore, color: 'green' },
                    { title: 'Berries', value: user?.berries ?? 0, color: 'gold' },
                    { title: 'Intentos', value: totalAttempts, color: 'red' }
                  ].map((stat, idx) => (
                    <Col xs={6} key={idx}>
                      <div className={`stat-box glass-inner-${stat.color}`}>
                        <small className="text-uppercase text-light opacity-50">{stat.title}</small>
                        <h2 className="text-white mb-0 fw-bold">{stat.value}</h2>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Historial de Progreso */}
        <Card className="profile-glass-card border-0">
          <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3">
            <h5 className="text-white mb-0">Islas Descubiertas</h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {progress.map((p) => (
                <Col xs={12} key={p.id}>
                  <div className="island-progress-item d-flex align-items-center justify-content-between p-3">
                    <div>
                      <h6 className="text-white mb-1">{p.islandName}</h6>
                      <Badge className={`badge-glass ${p.completed ? 'bg-success' : 'bg-secondary opacity-50'}`}>
                        {p.completed ? 'Completada' : 'En progreso'}
                      </Badge>
                    </div>
                    <div className="text-end text-white-50">
                      <div className="small">Puntos: <span className="text-white">{p.score}</span></div>
                      <div className="small">Intentos: <span className="text-white">{p.attempts}</span></div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ProfilePage;