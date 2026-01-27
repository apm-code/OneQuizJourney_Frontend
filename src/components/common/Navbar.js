import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      // por si el backend está caído, igual limpiamos navegación
      navigate('/');
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          One Quiz Journey
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/mapa">
                  Mapa
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil">
                  Perfil
                </Nav.Link>
                <Nav.Link as={Link} to="/ranking">
                  Ranking
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-2">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/">
                Iniciar sesión
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;