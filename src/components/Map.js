import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix default marker icons not loading correctly with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

// Recenters the map whenever start/end change
const Recenter = ({ start, end }) => {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      map.fitBounds([
        [start.lat, start.lng],
        [end.lat, end.lng],
      ]);
    } else if (start) {
      map.setView([start.lat, start.lng], 10);
    } else if (end) {
      map.setView([end.lat, end.lng], 10);
    }
  }, [start, end, map]);
  return null;
};

const Map = ({ start, end }) => {
  return (
    <div className="map-container">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={10}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {start && <Marker position={[start.lat, start.lng]} />}
        {end && <Marker position={[end.lat, end.lng]} />}
        <Recenter start={start} end={end} />
      </MapContainer>
    </div>
  );
};

export default Map;  );
};

export default Map;
