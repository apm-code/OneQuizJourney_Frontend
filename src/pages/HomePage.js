import React from 'react';
import './HomePage.css';
import { Container, Row, Col, Tab, Tabs, Card } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { devLogin } = useAuth();

  return (
    <div className="one-piece-bg">
      <Container className="d-flex align-items-center min-vh-100">
        <Row className="w-100">
          {/* Columna del formulario alineada a la izquierda */}
          <Col md={7} lg={5} className="ps-lg-5">
            <Card className="glass-card-extreme border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">

                <div className="text-center mb-4">
                  {/* Icono de calavera opcional si lo tienes, o un emoji */}
                  <div className="display-4 mb-2"> 💀
                  </div>
                  <h1 className="fw-bold h2 text-white">One Quiz Journey</h1>
                  <p className="text-light opacity-75">
                    ¡Embárcate en una aventura! Inicia sesión o regístrate.
                  </p>
                </div>

                <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-4 nav-justified custom-tabs-glass">
                  <Tab eventKey="login" title="Iniciar Sesión">
                    <div className="pt-2">
                      <LoginForm />
                    </div>
                  </Tab>
                  <Tab eventKey="register" title="Registrarse">
                    <div className="pt-2">
                      <RegisterForm />
                    </div>
                  </Tab>
                </Tabs>

                <div className="text-center mt-4 pt-3 border-top border-secondary">
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none text-light opacity-50"
                    onClick={devLogin}
                  >
                    Modo Desarrollador (Entrar)
                  </button>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="home-footer">
        <Container>
          <Row className="align-items-center gy-2">
            <Col md={6}>
              <div className="footer-brand">
                <span className="footer-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5892cc"><path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/></svg> </span>
                <span className="footer-text">ONE QUIZ JOURNEY</span>
              </div>
              <small className="footer-muted">
                Aprende, juega y conquista el conocimiento.
              </small>
            </Col>
            <Col md={6} className="text-md-end">
              <small className="footer-muted">
                © {new Date().getFullYear()} One Quiz Journey
              </small>
            </Col>
          </Row>
        </Container>
      </footer>


    </div>
  );
}

export default HomePage;