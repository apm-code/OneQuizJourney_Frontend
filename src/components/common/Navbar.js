
import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleJoinFleet = () => {
    // Va a Home 
    if (location.pathname !== '/') navigate('/');
    
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {

    } finally {
      navigate('/');
    }
  };

  return (
    <BootstrapNavbar expand="lg" className="oqj-navbar" fixed="top">
      <Container className="oqj-navbar-inner">
        <BootstrapNavbar.Brand as={Link} to="/" className="oqj-brand">
          <span className="oqj-brand-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5892cc"><path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/></svg></span>
          <span className="oqj-brand-text">ONE QUIZ JOURNEY</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="oqj-navbar-nav" />

        <BootstrapNavbar.Collapse id="oqj-navbar-nav">
          <Nav className="ms-auto oqj-navlinks">
            {user && (
              <>
                <Nav.Link as={Link} to="/mapa" className="oqj-link">
                  Mapa
                </Nav.Link>
                <Nav.Link as={Link} to="/ranking" className="oqj-link">
                  Ranking
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil" className="oqj-link">
                  Perfil
                </Nav.Link>
              </>
            )}
          </Nav>

          <div className="oqj-cta">
            {user ? (
              <Button className="oqj-cta-btn" onClick={handleLogout}>
                Desconectar
              </Button>
            ) : (
              <Button className="oqj-cta-btn" onClick={handleJoinFleet}>
                Login / Registro
              </Button>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;