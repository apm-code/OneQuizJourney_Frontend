import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <Container>
        <Row className="align-items-center gy-2">
          <Col md={6}>
            <div className="footer-brand">
              <span className="footer-text">ONE QUIZ JOURNEY</span>
            </div>
            <small className="footer-muted">Aprende, juega y conquista el conocimiento.</small>
          </Col>
          <Col md={6} className="text-md-end">
            <small className="footer-muted">
              © {new Date().getFullYear()} One Quiz Journey
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;