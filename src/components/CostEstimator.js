import React, { useState, useEffect } from 'react';
import './CostEstimator.css';

const RATE_KEY = 'trucking-estimator-rate';

const CostEstimator = ({ start, end }) => {
  const [rate, setRate] = useState(() => {
    const saved = localStorage.getItem(RATE_KEY);
    return saved ? parseFloat(saved) : 0.5;
  });
  const [cost, setCost] = useState(0);

  useEffect(() => {
    localStorage.setItem(RATE_KEY, rate);
  }, [rate]);

  const handleRateChange = (e) => {
    const value = parseFloat(e.target.value);
    setRate(isNaN(value) ? 0 : value);
  };

  const calculateCost = () => {
    if (start && end && rate) {
      const distance = calculateDistance(start, end);
      setCost(distance * rate);
    }
  };

  const calculateDistance = (start, end) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLon = (end.lng - start.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="cost-estimator">
      <h2>Cost Estimator</h2>
      <label className="rate-label">
        Rate per mile ($)
        <input
          type="number"
          step="0.01"
          min="0"
          value={rate}
          onChange={handleRateChange}
          className="rate-input"
        />
      </label>
      <button onClick={calculateCost}>Calculate Cost</button>
      <p className="cost-result">Estimated Cost: ${cost.toFixed(2)}</p>
    </div>
  );
};

export default CostEstimator;
