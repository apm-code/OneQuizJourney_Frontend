import React from 'react';
import InteractiveMap from '../components/map/InteractiveMap';
import './MapPage.css';

// Componente que representa la página completa del mapa
function MapPage() {
  return (
    // Contenedor principal de la página (normalmente aquí va el fondo visual)
    <div className="map-page-bg">
      
      {/* Wrapper que centra o limita el contenido */}
      <div className="map-content-wrapper">
        
        {/* Componente que contiene toda la lógica y renderizado del mapa interactivo */}
        <InteractiveMap />
      
      </div>
    </div>
  );
}

export default MapPage;