import React, { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import AddressInput from './components/AddressInput';
import Map from './components/Map';
import CostEstimator from './components/CostEstimator';
import './App.css';

const libraries = ['places'];

const App = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [rate, setRate] = useState(0.5); // Default rate per mile

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
    libraries,
  });

  const handleStartChange = (location) => {
    setStart(location);
  };

  const handleEndChange = (location) => {
    setEnd(location);
  };

  if (loadError) {
    return (
      <div className="app-container">
        <p>Error loading Google Maps. Check your API key.</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Trucking Cost Estimator</h1>
      <div className="address-section">
        <h2>Start Address</h2>
        <AddressInput onAddressChange={handleStartChange} isLoaded={isLoaded} />
      </div>
      <div className="address-section">
        <h2>End Address</h2>
        <AddressInput onAddressChange={handleEndChange} isLoaded={isLoaded} />
      </div>
      <div className="map-section">
        <Map start={start} end={end} isLoaded={isLoaded} />
      </div>
      <div className="cost-estimator-section">
        <CostEstimator start={start} end={end} rate={rate} />
      </div>
    </div>
  );
};

export default App;
