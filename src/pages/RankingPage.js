import React from 'react';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import './RankingPage.css';

import luffyAvatar from '../assets/luffy.jpg.webp';
import zoroAvatar from '../assets/zoro.jpg.webp';
import sanjiAvatar from '../assets/sanji.jpg.webp';
import aceAvatar from '../assets/ace.jpg.webp';

function RankingPage() {
  const ranking = [
    { id: 'u1', username: 'Luffy', completedIslands: 10, totalScore: 80, berries: 5000, avatar: luffyAvatar },
    { id: 'u2', username: 'Zoro', completedIslands: 9, totalScore: 75, berries: 2500, avatar: zoroAvatar },
    { id: 'u3', username: 'Sanji', completedIslands: 8, totalScore: 70, berries: 1500, avatar: sanjiAvatar },
    { id: 'u4', username: 'Adri', completedIslands: 1, totalScore: 7, berries: 0, avatar: aceAvatar },
  ];

  // (Opcional) ordenamos por score desc (por si luego viene del backend sin ordenar)
  const sorted = [...ranking].sort((a, b) => b.totalScore - a.totalScore);

  const getMedalBadge = (position) => {
    const baseClass = 'rank-badge medal-icon';

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
        return (
          <span className={`${baseClass} medal-default`}>
            {position}º
          </span>
        );
    }
  };

  const getRowClass = (position) => {
    if (position === 1) return 'row-gold';
    if (position === 2) return 'row-silver';
    if (position === 3) return 'row-bronze';
    return '';
  };

  return (
    <div className="ranking-page-bg">
      <div className="ranking-content-wrapper">
        <Container className="py-5">
          <h2 className="text-white fw-bold mb-4 title-shadow mt-5">Ranking</h2>

          <Card className="ranking-glass-card border-0">
            <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3 d-flex align-items-center justify-content-between">
              <div>
                <h5 className="text-white mb-0">Emperadores pirata (Mejores clasificados)</h5>
                <small className="text-white-50">Clasificación global</small>
              </div>
            </Card.Header>

            <Card.Body className="p-0">
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
                      const pos = index + 1;
                      return (
                        <tr key={u.id} className={getRowClass(pos)}>
                          <td className="ps-4">{getMedalBadge(pos)}</td>

                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div className="rank-avatar">
                                <img
                                  src={u.avatar}
                                  alt={`Avatar de ${u.username}`}
                                />
                              </div>
                              <div>
                                <div className="text-white fw-bold">{u.username}</div>
                                <small className="text-white-50">Tripulación: Straw Hats</small>
                              </div>
                            </div>
                          </td>

                          <td className="text-center text-white-75 fw-semibold">{u.completedIslands}</td>
                          <td className="text-center text-white fw-bold">{u.totalScore}</td>

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
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default RankingPage;