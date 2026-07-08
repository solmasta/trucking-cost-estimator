import React, { useState } from 'react';
import './CostEstimator.css';

const CostEstimator = ({ start, end, rate }) => {
  const [cost, setCost] = useState(0);

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
    return R * c; // Distance in miles
  };

  return (
    <div className="cost-estimator">
      <h2>Cost Estimator</h2>
      <p>Rate per mile: ${rate}</p>
      <button onClick={calculateCost}>Calculate Cost</button>
      <p>Estimated Cost: ${cost.toFixed(2)}</p>
    </div>
  );
};

export default CostEstimator;
