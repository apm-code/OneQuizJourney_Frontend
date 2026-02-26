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
      <Container className="d-flex align-items-center home-content-container">
        <Row className="w-100">
          {/* Columna del formulario alineada a la izquierda */}
          <Col md={7} lg={5} className="ps-lg-5">
            <Card className="glass-card-extreme border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">

                <div className="text-center mb-4">
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

    </div>
  );
}

export default HomePage;