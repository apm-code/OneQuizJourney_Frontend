
/*
Lo de la guía:

import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import api from '../services/api';

function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // Nota: Este endpoint necesitaría ser implementado en el backend
        const response = await api.get('/quiz/ranking');
        setRanking(response.data);
      } catch (err) {
        setError('Error al cargar el ranking.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando ranking...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const getMedalBadge = (position) => {
    switch (position) {
      case 1:
        return <Badge bg="warning" text="dark">🥇 1°</Badge>;
      case 2:
        return <Badge bg="secondary">🥈 2°</Badge>;
      case 3:
        return <Badge bg="danger">🥉 3°</Badge>;
      default:
        return <Badge bg="light" text="dark">{position}°</Badge>;
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Ranking de Piratas</h2>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Pirata</th>
            <th>Islas Completadas</th>
            <th>Puntuación Total</th>
            <th>Berries</th>
          </tr>
        </thead>
        <tbody>
          {ranking.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Aún no hay piratas en el ranking
              </td>
            </tr>
          ) : (
            ranking.map((user, index) => (
              <tr key={user.id}>
                <td>{getMedalBadge(index + 1)}</td>
                <td>
                  <strong>{user.username}</strong>
                </td>
                <td>{user.completedIslands}</td>
                <td>{user.totalScore}</td>
                <td>{user.berries}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default RankingPage;
*/

// Provisional:

import React from 'react';
import { Container, Table, Badge } from 'react-bootstrap';

function RankingPage() {
  const ranking = [
    { id: 'u1', username: 'Luffy', completedIslands: 10, totalScore: 80, berries: 3000 },
    { id: 'u2', username: 'Zoro', completedIslands: 9, totalScore: 75, berries: 2500 },
    { id: 'u3', username: 'Nami', completedIslands: 8, totalScore: 70, berries: 5000 },
    { id: 'u4', username: 'Adri', completedIslands: 1, totalScore: 7, berries: 0 },
  ];

  const getMedalBadge = (position) => {
    switch (position) {
      case 1:
        return <Badge bg="warning" text="dark">🥇 1°</Badge>;
      case 2:
        return <Badge bg="secondary">🥈 2°</Badge>;
      case 3:
        return <Badge bg="danger">🥉 3°</Badge>;
      default:
        return <Badge bg="light" text="dark">{position}°</Badge>;
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Ranking (mock)</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Pirata</th>
            <th>Islas Completadas</th>
            <th>Puntuación Total</th>
            <th>Berries</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((u, index) => (
            <tr key={u.id}>
              <td>{getMedalBadge(index + 1)}</td>
              <td><strong>{u.username}</strong></td>
              <td>{u.completedIslands}</td>
              <td>{u.totalScore}</td>
              <td>{u.berries}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default RankingPage;