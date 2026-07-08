import React, { useState } from 'react';
import AddressInput from './components/AddressInput';
import Map from './components/Map';
import CostEstimator from './components/CostEstimator';
import FuelLog from './components/FuelLog';
import BillsTracker from './components/BillsTracker';
import './App.css';

const TABS = [
  { id: 'estimator', label: 'Estimator' },
  { id: 'fuel', label: 'Fuel Log' },
  { id: 'bills', label: 'Bills & Calendar' },
];

const App = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [activeTab, setActiveTab] = useState('estimator');

  const handleStartChange = (location) => setStart(location);
  const handleEndChange = (location) => setEnd(location);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Trucking Cost Estimator</h1>
        <nav className="app-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === 'estimator' && (
        <div className="tab-panel">
          <div className="card address-section">
            <h2>Start Address</h2>
            <AddressInput onAddressChange={handleStartChange} />
          </div>
          <div className="card address-section">
            <h2>End Address</h2>
            <AddressInput onAddressChange={handleEndChange} />
          </div>
          <div className="card map-section">
            <Map start={start} end={end} />
          </div>
          <div className="card cost-estimator-section">
            <CostEstimator start={start} end={end} />
          </div>
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="tab-panel">
          <FuelLog />
        </div>
      )}

      {activeTab === 'bills' && (
        <div className="tab-panel">
          <BillsTracker />
        </div>
      )}
    </div>
  );
};

export default App;
