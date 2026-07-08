import React, { useState } from 'react';
import AddressInput from './components/AddressInput';
import Map from './components/Map';
import CostEstimator from './components/CostEstimator';
import './App.css';

const App = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [rate] = useState(0.5); // Default rate per mile

  const handleStartChange = (location) => {
    setStart(location);
  };

  const handleEndChange = (location) => {
    setEnd(location);
  };

  return (
    <div className="app-container">
      <h1>Trucking Cost Estimator</h1>
      <div className="address-section">
        <h2>Start Address</h2>
        <AddressInput onAddressChange={handleStartChange} />
      </div>
      <div className="address-section">
        <h2>End Address</h2>
        <AddressInput onAddressChange={handleEndChange} />
      </div>
      <div className="map-section">
        <Map start={start} end={end} />
      </div>
      <div className="cost-estimator-section">
        <CostEstimator start={start} end={end} rate={rate} />
      </div>
    </div>
  );
};

export default App;
