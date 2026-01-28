
import React from 'react';
import InteractiveMap from '../components/map/InteractiveMap';
import './MapPage.css'; // Crearemos este archivo

function MapPage() {
  return (
    <div className="map-page-bg">
      <div className="map-content-wrapper">
        <InteractiveMap />
      </div>
    </div>
  );
}

export default MapPage;