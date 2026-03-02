import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Table, Spinner, Alert } from 'react-bootstrap';
import './RankingPage.css';
import { getAvatarImagePath, PLACEHOLDER_IMAGE, SAFE_FALLBACK_IMAGE } from '../utils/imagePaths';
import { getRanking } from '../services/quiz.api';

function RankingPage() {
  // Estado principal del ranking
  const [ranking, setRanking] = useState([]); // Lista de usuarios con sus stats
  const [loading, setLoading] = useState(true); // Loading mientras se pide el ranking
  const [error, setError] = useState(''); // Mensaje de error si falla la carga

  // useEffect: al entrar en la página, se carga el ranking desde el backend
  useEffect(() => {
    let mounted = true; // Para evitar setState si el componente se desmonta

    const loadRanking = async () => {
      try {
        setLoading(true);
        setError(''); // Limpiamos error anterior

        // Llamada al backend para obtener el ranking
        const rankingData = await getRanking();

        // Guardamos datos en el estado (siempre asegurando que sea un array)
        if (mounted) {
          setRanking(Array.isArray(rankingData) ? rankingData : []);
        }
      } catch (err) {
        // Si falla, guardamos mensaje y dejamos ranking vacío
        if (mounted) {
          setError(err.response?.data?.message || 'No se pudo cargar el ranking.');
          setRanking([]);
        }
      } finally {
        // Quitamos loading pase lo que pase
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRanking();

    // Cleanup para evitar actualizar estado cuando ya no estamos en esta página
    return () => {
      mounted = false;
    };
  }, []);

  // Ordenamos por totalScore descendente (por si el backend no viene ordenado)
  // useMemo evita recalcular el sort si ranking no cambia
  const sorted = useMemo(
    () => [...ranking].sort((a, b) => b.totalScore - a.totalScore),
    [ranking]
  );

  // Devuelve el badge de posición (medalla para top 3)
  const getMedalBadge = (position) => {
    const baseClass = 'rank-badge medal-icon'; // Clases comunes para todos los badges

    switch (position) {
      case 1:
        return (
          <span className={`${baseClass} medal-gold`}>
            <span className="material-symbols-outlined">workspace_premium</span>
            1º
          </span>
        );
      case 2:
        return (
          <span className={`${baseClass} medal-silver`}>
            <span className="material-symbols-outlined">workspace_premium</span>
            2º
          </span>
        );
      case 3:
        return (
          <span className={`${baseClass} medal-bronze`}>
            <span className="material-symbols-outlined">workspace_premium</span>
            3º
          </span>
        );
      default:
        // Para el resto de posiciones, solo muestra el número
        return (
          <span className={`${baseClass} medal-default`}>
            {position}º
          </span>
        );
    }
  };

  // Devuelve una clase CSS según la posición (para colorear filas del top 3)
  const getRowClass = (position) => {
    if (position === 1) return 'row-gold';
    if (position === 2) return 'row-silver';
    if (position === 3) return 'row-bronze';
    return '';
  };

  return (
    <div className="ranking-page-bg"> {/* Fondo general de la página */}
      <div className="ranking-content-wrapper"> {/* Wrapper para centrar el contenido */}
        <Container className="py-5">
          <h2 className="text-white fw-bold mb-4 title-shadow mt-5">Ranking</h2>

          <Card className="ranking-glass-card border-0">
            <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3 d-flex align-items-center justify-content-between">
              <div>
                <h5 className="text-white mb-0">Ranking global de piratas</h5>
                <small className="text-white-50">Se muestran todos los usuarios</small>
              </div>
            </Card.Header>

            <Card.Body className="p-0">
              {/* Estado: loading */}
              {loading && (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="light" />
                </div>
              )}

              {/* Estado: error */}
              {!loading && error && (
                <div className="p-3">
                  <Alert variant="danger" className="mb-0">{error}</Alert>
                </div>
              )}

              {/* Estado: sin datos */}
              {!loading && !error && sorted.length === 0 && (
                <div className="p-4 text-center text-white-50">
                  Todavía no hay datos de ranking.
                </div>
              )}

              {/* Estado: datos OK */}
              {!loading && !error && sorted.length > 0 && (
                <div className="table-responsive">
                  <Table hover className="ranking-table mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="ps-4">Posición</th>
                        <th>Pirata</th>
                        <th className="text-center">Islas</th>
                        <th className="text-center">Puntos</th>
                        <th className="pe-4 text-end">Berries</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sorted.map((u, index) => {
                        const pos = index + 1; // Posición real del usuario en el ranking
                        return (
                          <tr key={u.id} className={getRowClass(pos)}>
                            {/* Columna posición */}
                            <td className="ps-4">{getMedalBadge(pos)}</td>

                            {/* Columna usuario + avatar */}
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="rank-avatar">
                                  <img
                                    // Se usa el avatar guardado: si no hay, usa uno basado en el nombre de usuario
                                    src={u.avatarUrl || getAvatarImagePath(u.username)}
                                    alt={`Avatar de ${u.username}`}

                                    // Fallback si la imagen falla
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
                                      img.onerror = null;
                                      img.src = SAFE_FALLBACK_IMAGE;
                                    }}
                                  />
                                </div>

                                {/* Texto usuario */}
                                <div>
                                  <div className="text-white fw-bold">{u.username}</div>
                                  <small className="text-white-50">Tripulación: Straw Hats</small>
                                </div>
                              </div>
                            </td>

                            {/* Columna islas completadas */}
                            <td className="text-center text-white-75 fw-semibold">
                              {u.completedIslands}
                            </td>

                            {/* Columna puntos totales */}
                            <td className="text-center text-white fw-bold">
                              {u.totalScore}
                            </td>

                            {/* Columna berries */}
                            <td className="pe-4 text-end">
                              <span className="berries-pill">
                                <span className="material-symbols-outlined berry-icon">money_bag</span>
                                {u.berries.toLocaleString('es-ES')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default RankingPage;