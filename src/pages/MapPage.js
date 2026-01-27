
/*
Original de la guía:

import React from 'react';

function MapPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>MapPage</h1>
      <p>Aquí irá el mapa interactivo.</p>
    </div>
  );
}

export default MapPage;
*/

// Provisional:

import React from 'react';
import { Container } from 'react-bootstrap';
import InteractiveMap from '../components/map/InteractiveMap';

function MapPage() {
  return (
    <Container className="mt-4">
      <InteractiveMap />
    </Container>
  );
}

export default MapPage;