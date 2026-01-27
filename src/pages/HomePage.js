import React from 'react';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext'; // Importanción provisional

function HomePage() {
  const { devLogin } = useAuth(); // Eliminar. Provisional
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center mb-4">One Quiz Journey</h1>
          <p className="text-center mb-4">
            ¡Embárcate en una aventura! Inicia sesión o regístrate para empezar.
          </p>

          
          <div className="text-center mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={devLogin}
            >
              Entrar (DEV)
            </button>
          </div>
          

          <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-3">
            <Tab eventKey="login" title="Iniciar Sesión">
              <LoginForm />
            </Tab>
            <Tab eventKey="register" title="Registrarse">
              <RegisterForm />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;