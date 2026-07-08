import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import './Map.css';

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const Map = ({ start, end, isLoaded }) => {
  const [center, setCenter] = useState(defaultCenter);

  const onLoad = (map) => {
    const mapCenter = map.getCenter();
    if (mapCenter) {
      setCenter({ lat: mapCenter.lat(), lng: mapCenter.lng() });
    }
  };

  if (!isLoaded) {
    return (
      <div className="map-container">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        zoom={10}
        center={start || end || center}
        onLoad={onLoad}
      >
        {start && <Marker position={start} />}
        {end && <Marker position={end} />}
      </GoogleMap>
    </div>
  );
};

export default Map;
