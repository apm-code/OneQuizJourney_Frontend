import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      {" "}
      {/* Contenedor principal del footer */}
      <Container>
        {" "}
        {/* Contenedor de Bootstrap para centrar el contenido */}
        <Row className="align-items-center gy-2">
          {" "}
          {/* Fila con alineación vertical centrada y pequeño espacio vertical */}
          {/* Columna izquierda */}
          <Col md={6}>
            <div className="footer-brand">
              {" "}
              {/* Parte donde aparece el logo + nombre */}
              {/* Icono SVG decorativo */}
              <span className="footer-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5892cc"
                >
                  <path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z" />
                </svg>
              </span>
              {/* Texto del nombre del proyecto */}
              <span className="footer-text">ONE QUIZ JOURNEY</span>
            </div>

          </Col>
          {/* Columna derecha: avisos de copyright */}
          <Col md={6} className="text-md-end">
            <small className="footer-muted d-block">
              © {new Date().getFullYear()} One Quiz Journey
            </small>
            <small className="footer-muted d-block mt-1">
              One Piece © Eiichiro Oda / Shueisha · Toei Animation. Todas las
              imágenes y personajes pertenecen a sus respectivos propietarios.
            </small>
            <small className="footer-disclaimer d-block mt-1">
              Trabajo de Fin de Grado realizado por Adrián Ignacio Pérez Martos
              y Abraham Canralejo Guerrero, alumnos de DAW II, UNIR FP.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
