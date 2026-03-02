import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Container, Row, Col, Tab, Tabs, Card, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { getPublicRanking, getProgress } from '../services/quiz.api';
import { getAvatarImagePath, PLACEHOLDER_IMAGE, SAFE_FALLBACK_IMAGE } from '../utils/imagePaths';
import { useAuth } from '../context/AuthContext';
import sunnyIcon from '../assets/thousand-sunny.png';

function HomePage() {
  const { user } = useAuth();      // Usuario autenticado (null si no hay sesión)
  const navigate = useNavigate();  // Navegación programática

  // Estado del ranking (top 3)
  const [topRanking, setTopRanking] = useState([]); // Lista con los 3 primeros usuarios
  const [loadingRanking, setLoadingRanking] = useState(true); // Indica si se está cargando el ranking
  const [rankingError, setRankingError] = useState(false); // Indica si hubo error al cargar el ranking

  // Puntuación total del usuario (calculada desde el progreso, no viene en el perfil)
  const [userTotalScore, setUserTotalScore] = useState(null); // null = cargando

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    getProgress()
      .then(data => {
        if (mounted && Array.isArray(data)) {
          // Suma los puntos de cada isla (igual que hace ProfilePage)
          setUserTotalScore(data.reduce((acc, p) => acc + Number(p.score || 0), 0));
        }
      })
      .catch(() => { if (mounted) setUserTotalScore(0); });
    return () => { mounted = false; };
  }, [user]);

  // useEffect: al cargar la página, pide el ranking público al backend
  useEffect(() => {
    let mounted = true; // Para evitar setState si el componente se desmonta

    const loadTopRanking = async () => { // Función que carga el top ranking
      try {
        setRankingError(false); // Resetea el estado de error
        const data = await getPublicRanking(); // Llama a la API (ruta pública)
        
        if (mounted) {
          // Normalizamos por seguridad (por si el backend no devuelve un array)
          const normalized = Array.isArray(data) ? data : [];
          // Guardamos solo los 3 primeros
          setTopRanking(normalized.slice(0, 3));
        }
      } catch {
        // Si falla la petición, mostramos error y vaciamos ranking
        if (mounted) {
          setRankingError(true);
          setTopRanking([]);
        }
      } finally {
        // Terminamos la carga del ranking
        if (mounted) {
          setLoadingRanking(false);
        }
      }
    };

    loadTopRanking(); // Ejecuta la carga al montar el componente

    // Cleanup: si nos vamos de la pantalla, evitamos actualizar estados
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="one-piece-bg"> {/* Fondo general estilo One Piece */}
      <Container className="home-content-container">

        {/* Fila principal (hero): estadísticas si hay sesión, login/registro si no */}
        <Row className="home-hero-row">

          {user ? (
            /* ── USUARIO LOGUEADO: 3 tarjetas de resumen ── */
            <Col xs={12} lg={10} className="mx-auto">

              {/* Cabecera: icono + bienvenida */}
              <div className="text-center mb-4">
                <img
                  src={sunnyIcon} // Icono del Thousand Sunny
                  alt="Thousand Sunny"
                  className="sunny-icon mb-2" // Tamaño controlado por CSS
                />
                <h1 className="fw-bold h2 text-white">¡Bienvenido, {user.username}!</h1>
                <p className="text-light opacity-75">Tu aventura continúa. ¿Listo para zarpar?</p>
              </div>

              <Row className="g-3">

                {/* Card 1: Puntuación total (calculada desde el progreso) */}
                <Col md={4}>
                  <Card className="glass-card-extreme border-0 h-100">
                    <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center">
                      <p className="text-white-50 small fw-bold text-uppercase mb-3">Puntuación Total</p>
                      <div className="home-stat-big-number text-warning">
                        {userTotalScore === null
                          ? <Spinner animation="border" size="sm" variant="warning" />
                          : Number(userTotalScore).toLocaleString('es-ES')}
                      </div>
                      <small className="text-white-50 mt-1">puntos acumulados</small>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Card 2: Avatar + botón al mapa */}
                <Col md={4}>
                  <Card className="glass-card-extreme border-0 h-100">
                    <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center">
                      <div className="home-stat-avatar mb-3">
                        <img
                          src={user.avatarUrl || getAvatarImagePath(user.username)}
                          alt="Avatar"
                          onError={(e) => {
                            const img = e.currentTarget;
                            const step = img.dataset.fallbackStep || '0';
                            if (step === '0') { img.dataset.fallbackStep = '1'; img.src = PLACEHOLDER_IMAGE; return; }
                            img.onerror = null; img.src = SAFE_FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <h4 className="text-white fw-bold mb-3">{user.username}</h4>
                      <Button
                        variant="warning"
                        className="fw-bold px-4 w-100"
                        onClick={() => navigate('/mapa')}
                      >
                        Ir al Mapa
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Card 3: Berries */}
                <Col md={4}>
                  <Card className="glass-card-extreme border-0 h-100">
                    <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center">
                      <p className="text-white-50 small fw-bold text-uppercase mb-3">Berries</p>
                      <div className="home-stat-big-number text-warning">
                        {Number(user.berries || 0).toLocaleString('es-ES')}
                      </div>
                      <small className="text-white-50 mt-1">monedas del reino</small>
                    </Card.Body>
                  </Card>
                </Col>

              </Row>
            </Col>

          ) : (
            /* ── SIN SESIÓN: formulario login / registro ── */
            <Col md={7} lg={5} className="ps-lg-5 mb-4 mb-lg-0">
              <Card className="glass-card-extreme border-0 shadow-lg">
                <Card.Body className="p-4 p-md-5">

                  {/* Cabecera: icono + título */}
                  <div className="text-center mb-4">
                    <img
                      src={sunnyIcon} // Icono del Thousand Sunny
                      alt="Thousand Sunny"
                      className="sunny-icon mb-2" // Tamaño controlado por CSS
                    />
                    <h1 className="fw-bold h2 text-white">One Quiz Journey</h1>
                    <p className="text-light opacity-75">
                      ¡Embárcate en una aventura! Inicia sesión o regístrate.
                    </p>
                  </div>

                  {/* Tabs: Login / Registro */}
                  <Tabs
                    defaultActiveKey="login" // Por defecto muestra la pestaña login
                    id="auth-tabs"
                    className="mb-4 nav-justified custom-tabs-glass"
                  >
                    <Tab eventKey="login" title="Iniciar Sesión">
                      <div className="pt-2">
                        <LoginForm /> {/* Componente de login */}
                      </div>
                    </Tab>

                    <Tab eventKey="register" title="Registrarse">
                      <div className="pt-2">
                        <RegisterForm /> {/* Componente de registro */}
                      </div>
                    </Tab>
                  </Tabs>

                </Card.Body>
              </Card>
            </Col>
          )}

        </Row>

        {/* Fila ranking: top 3 usuarios */}
        <Row className="justify-content-center home-ranking-row">
          <Col md={10} lg={8}>
            <Card className="home-ranking-card border-0 w-100">
              <Card.Body className="p-4 p-md-5">
                <h3 className="home-claim text-white fw-bold mb-2">
                  Unete a la conquista de los mares
                </h3>
                <p className="text-light opacity-75 mb-4">
                  Estos son los tres piratas mejor clasificados ahora mismo.
                </p>

                {/* Estado: cargando ranking */}
                {loadingRanking && (
                  <div className="text-center py-3">
                    <Spinner animation="border" variant="light" size="sm" />
                  </div>
                )}

                {/* Estado: error al cargar ranking */}
                {!loadingRanking && rankingError && (
                  <div className="text-light opacity-75">No se pudo cargar el ranking.</div>
                )}

                {/* Estado: ranking vacío */}
                {!loadingRanking && !rankingError && topRanking.length === 0 && (
                  <div className="text-light opacity-75">Todavia no hay datos de ranking.</div>
                )}

                {/* Estado: ranking OK (mostramos top 3) */}
                {!loadingRanking && !rankingError && topRanking.length > 0 && (
                  <div className="home-top-list">
                    {topRanking.map((user, index) => (
                      <div className="home-top-item" key={user.id}>
                        <span className="home-top-position">{index + 1}º</span>

                        {/* Avatar del usuario */}
                        <div className="home-top-avatar">
                          <img
                            // Si no hay avatarUrl, intenta sacar imagen por username
                            src={user.avatarUrl || getAvatarImagePath(user.username)}
                            alt={`Avatar de ${user.username}`}

                            // Fallback si falla la imagen
                            onError={(e) => {
                              const img = e.currentTarget;
                              const step = img.dataset.fallbackStep || '0';

                              // Primer intento: placeholder
                              if (step === '0') {
                                img.dataset.fallbackStep = '1';
                                img.src = PLACEHOLDER_IMAGE;
                                return;
                              }

                              // Segundo intento: imagen segura final
                              img.onerror = null; // Evita bucle infinito
                              img.src = SAFE_FALLBACK_IMAGE;
                            }}
                          />
                        </div>

                        {/* Nombre y puntos */}
                        <div className="home-top-user">
                          <div className="text-white fw-semibold">{user.username}</div>
                          <small className="text-light opacity-75">{user.totalScore} pts</small>
                        </div>

                        {/* Berries formateadas con separador de miles */}
                        <div className="home-top-berries">
                          {Number(user.berries || 0).toLocaleString('es-ES')} berries
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Fila informativa: cómo funciona + recompensas */}
        <Row className="justify-content-center home-info-row">
          {/* Columna: cómo funciona */}
          <Col md={10} lg={4} className="mb-3 mb-lg-0">
            <Card className="home-info-card border-0 h-100">
              <Card.Body className="p-4">
                <h4 className="text-white fw-bold mb-3">Como funciona</h4>
                <div className="home-step-list">
                  <div className="home-step-item">
                    <span className="home-step-index">1</span>
                    <span>Registrate y navega hacia cada isla.</span>
                  </div>
                  <div className="home-step-item">
                    <span className="home-step-index">2</span>
                    <span>Supera quizzes en cada isla.</span>
                  </div>
                  <div className="home-step-item">
                    <span className="home-step-index">3</span>
                    <span>Sube posiciones en el ranking global.</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Columna: recompensas */}
          <Col md={10} lg={4}>
            <Card className="home-info-card border-0 h-100">
              <Card.Body className="p-4">
                <h4 className="text-white fw-bold mb-3">Recompensas</h4>
                <div className="home-step-list">
                  <div className="home-step-item">
                    <span className="home-reward-dot" />
                    <span>Gana berries en cada quiz.</span>
                  </div>
                  <div className="home-step-item">
                    <span className="home-reward-dot" />
                    <span>Mejora tu perfil y tu progreso.</span>
                  </div>
                  <div className="home-step-item">
                    <span className="home-reward-dot" />
                    <span>Compite por el top del ranking.</span>
                  </div>
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