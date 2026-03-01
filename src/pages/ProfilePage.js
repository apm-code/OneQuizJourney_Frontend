import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';
import { CHARACTER_IMAGE_KEYS, getCharacterImagePath, PLACEHOLDER_IMAGE, SAFE_FALLBACK_IMAGE } from '../utils/imagePaths';
import { getProgress, getMyCards } from '../services/quiz.api';
import api from '../services/api';

// Devuelve la variante Bootstrap para el badge según la rareza de la carta
const rarityVariant = (rarity) => {
  if (!rarity) return 'secondary';
  const r = rarity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (r === 'legendary' || r === 'legendaria') return 'warning';
  if (r === 'rare' || r === 'rara' || r === 'epica') return 'info';
  return 'secondary';
};

function ProfilePage() {
  const { user, refreshProfile } = useAuth(); // Cogemos el usuario (si ya está logueado) y la función para refrescar el perfil desde el backend
  const [profile, setProfile] = useState(user);  // Estado del perfil mostrado (normalmente será el user del contexto, pero lo podemos refrescar)
  const [progress, setProgress] = useState([]);// Estado del progreso del usuario (islas completadas, intentos, puntos por isla, etc.)

  // Estados de carga y error general (progreso)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados del álbum de cartas
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState('');

  // Estados relacionados con el cambio de avatar
  const [avatarSaving, setAvatarSaving] = useState(false); // Indica si se está guardando el avatar
  const [avatarError, setAvatarError] = useState(''); // Error si no se puede guardar el avatar
  const [showAvatarPicker, setShowAvatarPicker] = useState(false); // Muestra/oculta el selector de avatares

  // useEffect: al entrar en la página, carga el progreso del usuario
  useEffect(() => {
    let mounted = true; // Para evitar setState si el componente se desmonta

    const loadProgress = async () => {
      try {
        setLoading(true); // Activamos spinner
        setError(''); // Limpiamos error anterior

        // Petición al backend para obtener progreso
        const progressData = await getProgress();

        if (mounted) {
          // Normalizamos por seguridad
          setProgress(Array.isArray(progressData) ? progressData : []);
        }
      } catch (err) {
        // Si falla, guardamos error y vaciamos progreso
        if (mounted) {
          setError(err.response?.data?.message || 'No se pudo cargar el progreso.');
          setProgress([]);
        }
      } finally {
        // Quitamos loading pase lo que pase
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProgress();

    return () => {
      mounted = false;
    };
  }, []);

  // useEffect: carga/refresca el perfil desde el backend
  // Esto sirve para tener berries/avatar actualizado aunque el contexto tenga datos antiguos
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await refreshProfile(); // Pide /auth/profile y actualiza el user del contexto
        if (mounted) {
          setProfile(data); // Guardamos en el estado local de esta página
        }
      } catch (err) {
        // Si falla, nos quedamos con el user actual del contexto
        if (mounted) {
          setProfile(user);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user, refreshProfile]);

  // Función para seleccionar avatar (se llama al hacer click en uno de los avatares)
  const handleAvatarSelect = async (avatarKey) => {
    const avatarUrl = getCharacterImagePath(avatarKey); // Convierte la "key" en ruta real de imagen

    // Si ya tiene ese avatar o si estamos guardando, no hacemos nada
    if (profile?.avatarUrl === avatarUrl || avatarSaving) return;

    try {
      setAvatarSaving(true); // Bloquea botones y muestra "guardando..."
      setAvatarError(''); // Limpia errores anteriores

      // Llama al backend para actualizar el avatar del usuario autenticado
      await api.patch('/auth/profile/avatar', { avatarUrl });

      // Refresca el perfil para tener el avatar actualizado en pantalla y en el contexto
      const updated = await refreshProfile();
      setProfile(updated);

      // Cierra el selector de avatares
      setShowAvatarPicker(false);
    } catch (err) {
      // Si falla, muestra mensaje de error
      setAvatarError(err.response?.data?.message || 'No se pudo actualizar el avatar.');
    } finally {
      setAvatarSaving(false); // Terminamos el guardado
    }
  };

  // useEffect: carga las cartas del usuario
  useEffect(() => {
    let mounted = true;

    const loadCards = async () => {
      try {
        setCardsLoading(true);
        setCardsError('');
        const cardsData = await getMyCards();
        if (mounted) setCards(Array.isArray(cardsData) ? cardsData : []);
      } catch (err) {
        if (mounted) {
          setCardsError(err.response?.data?.message || 'No se pudieron cargar las cartas.');
          setCards([]);
        }
      } finally {
        if (mounted) setCardsLoading(false);
      }
    };

    loadCards();

    return () => { mounted = false; };
  }, []);

  // useMemo: transforma el progreso en un formato más "limpio" y fácil de usar en la vista
  // Se recalcula solo cuando cambia "progress"
  const normalizedProgress = useMemo(
    () =>
      progress.map((p) => ({
        id: p.id, // id del registro de progreso
        islandName: p.island?.name || 'Isla desconocida', // nombre de la isla (viene dentro de island)
        completed: Boolean(p.completed), // asegura true/false
        score: Number(p.score || 0), // asegura número
        attempts: Number(p.attempts || 0), // asegura número
      })),
    [progress]
  );

  // Estadísticas generales calculadas desde normalizedProgress
  const completedIslands = normalizedProgress.filter((p) => p.completed).length; // Nº de islas completadas
  const totalScore = normalizedProgress.reduce((acc, p) => acc + p.score, 0); // Suma de puntos
  const totalAttempts = normalizedProgress.reduce((acc, p) => acc + p.attempts, 0); // Suma de intentos

  return (
    <div className="profile-page-bg">
      <Container className="py-5">
        <h2 className="text-white fw-bold mb-4 title-shadow">Bitácora de Viaje</h2>

        {/* Tarjeta principal del perfil */}
        <Card className="profile-glass-card mb-4 border-0">
          <Card.Body className="p-4">
            <Row className="align-items-center">

              {/* Columna izquierda: avatar + nombre + selector */}
              <Col md={4} className="text-center mb-4 mb-md-0">
                <div className="avatar-wrapper shadow-lg mb-3">
                  <button
                    type="button"
                    className="btn p-0 border-0 bg-transparent"
                    onClick={() => setShowAvatarPicker((prev) => !prev)} // Abre/cierra el selector
                    title="Cambiar avatar"
                    disabled={avatarSaving} // Si está guardando, no deja clicar
                  >
                    <img
                      // Usa avatar guardado; si no existe, usa uno por defecto según username (o luffy)
                      src={profile?.avatarUrl || getCharacterImagePath(profile?.username || 'luffy')}
                      alt="Avatar"
                      className="avatar-img"
                      width={200}
                      height={200}
                      // Fallback si falla la imagen
                      onError={(e) => {
                        const img = e.currentTarget;
                        const step = img.dataset.fallbackStep || '0';
                        if (step === '0') {
                          img.dataset.fallbackStep = '1';
                          img.src = PLACEHOLDER_IMAGE;
                          return;
                        }
                        img.onerror = null;
                        img.src = SAFE_FALLBACK_IMAGE;
                      }}
                    />
                  </button>
                </div>

                {/* Nombre y rango */}
                <h3 className="text-white fw-bold">{profile?.username || 'Pirata'}</h3>
                <p className="text-warning mb-0">Rango: Supernova</p>

                {/* Selector de avatares */}
                {showAvatarPicker && (
                  <div className="mt-3 p-2 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {CHARACTER_IMAGE_KEYS.map((key) => {
                        const avatarUrl = getCharacterImagePath(key);
                        const isActive = profile?.avatarUrl === avatarUrl; // Marca el avatar actual

                        return (
                          <button
                            key={key}
                            type="button"
                            className={`btn p-0 border-0 bg-transparent ${isActive ? 'opacity-100' : 'opacity-75'}`}
                            onClick={() => handleAvatarSelect(key)} // Selecciona y guarda el avatar
                            disabled={avatarSaving}
                            title={key}
                          >
                            <img
                              src={avatarUrl}
                              alt={key}
                              width={54}
                              height={54}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: isActive ? '2px solid #f5c542' : '1px solid rgba(255,255,255,0.25)',
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Mensajes del guardado */}
                    {avatarSaving && <small className="text-white-50 d-block mt-2">Guardando avatar...</small>}
                    {avatarError && <Alert variant="danger" className="py-2 mt-2 mb-0">{avatarError}</Alert>}
                  </div>
                )}
              </Col>

              {/* Columna derecha: estadísticas generales */}
              <Col md={8}>
                <h5 className="text-white opacity-75 mb-4">Estadísticas de Navegación</h5>
                <Row className="g-3">
                  {[
                    { title: 'Islas', value: completedIslands, color: 'blue' },
                    { title: 'Puntos', value: totalScore, color: 'green' },
                    { title: 'Berries', value: profile?.berries ?? 0, color: 'gold' },
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

        {/* Historial de progreso por islas */}
        <Card className="profile-glass-card border-0">
          <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3">
            <h5 className="text-white mb-0">Islas Descubiertas</h5>
          </Card.Header>

          <Card.Body>
            {/* Loading de progreso */}
            {loading && (
              <div className="text-center py-3">
                <Spinner animation="border" variant="light" />
              </div>
            )}

            {/* Error al cargar progreso */}
            {!loading && error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-3">
              {/* Si no hay progreso */}
              {!loading && !error && normalizedProgress.length === 0 && (
                <Col xs={12}>
                  <div className="island-progress-item d-flex align-items-center justify-content-between p-3">
                    <div>
                      <h6 className="text-white mb-1">Todavía no hay progreso</h6>
                      <small className="text-white-50">Completa tu primer quiz para empezar tu bitácora.</small>
                    </div>
                  </div>
                </Col>
              )}

              {/* Lista de progreso por isla */}
              {!loading && !error && normalizedProgress.map((p) => (
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

        {/* Álbum de cartas */}
        <Card className="profile-glass-card border-0 mt-4">
          <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3 d-flex align-items-center gap-2">
            <h5 className="text-white mb-0">Álbum de Cartas</h5>
            <Badge bg="warning" text="dark">{cards.length}</Badge>
          </Card.Header>

          <Card.Body>
            {/* Loading de cartas */}
            {cardsLoading && (
              <div className="text-center py-3">
                <Spinner animation="border" variant="light" />
              </div>
            )}

            {/* Error al cargar cartas */}
            {!cardsLoading && cardsError && <Alert variant="danger">{cardsError}</Alert>}

            {/* Sin cartas aún */}
            {!cardsLoading && !cardsError && cards.length === 0 && (
              <div className="text-center py-4">
                <p className="text-white-50 mb-1">Tu álbum está vacío</p>
                <small className="text-white-50">Completa una isla con el 100% de aciertos para ganar tu primera carta</small>
              </div>
            )}

            {/* Grid de cartas */}
            {!cardsLoading && !cardsError && cards.length > 0 && (
              <Row className="g-3">
                {cards.map((card) => (
                  <Col xs={6} sm={4} md={3} key={card.userCardId}>
                    <div className={`album-card rarity-${rarityVariant(card.rarity)}`}>
                      <img
                        src={getCharacterImagePath(card.name)}
                        alt={card.name}
                        className="album-card-img"
                        onError={(e) => {
                          const img = e.currentTarget;
                          const step = img.dataset.fallbackStep || '0';
                          // 1º: imageUrl de la API
                          if (step === '0') { img.dataset.fallbackStep = '1'; img.src = card.imageUrl; return; }
                          // 2º: placeholder genérico
                          if (step === '1') { img.dataset.fallbackStep = '2'; img.src = PLACEHOLDER_IMAGE; return; }
                          // 3º: imagen de seguridad final
                          img.onerror = null; img.src = SAFE_FALLBACK_IMAGE;
                        }}
                      />
                      <div className="album-card-body">
                        <p className="album-card-name">{card.name}</p>
                        {card.title && <small className="album-card-title">{card.title}</small>}
                        <Badge bg={rarityVariant(card.rarity)} className="mt-1">{card.rarity}</Badge>
                        {card.bounty && (
                          <small className="d-block text-warning mt-1">
                            {Number(card.bounty).toLocaleString('es-ES')} <span className="text-white-50">berries</span>
                          </small>
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>

      </Container>
    </div>
  );
}

export default ProfilePage;