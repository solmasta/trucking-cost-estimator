import React, { useState, useEffect } from 'react';
import './FuelLog.css';

const LOG_KEY = 'trucking-fuel-log';
const emptyEntry = { date: '', location: '', pricePerGallon: '', gallons: '' };

const FuelLog = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(LOG_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState(emptyEntry);

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.date || !form.location || !form.pricePerGallon || !form.gallons) return;
    const entry = {
      id: Date.now(),
      date: form.date,
      location: form.location,
      pricePerGallon: parseFloat(form.pricePerGallon),
      gallons: parseFloat(form.gallons),
    };
    setEntries([entry, ...entries]);
    setForm(emptyEntry);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const totalSpent = entries.reduce((sum, e) => sum + e.pricePerGallon * e.gallons, 0);
  const avgPrice = entries.length
    ? entries.reduce((sum, e) => sum + e.pricePerGallon, 0) / entries.length
    : 0;

  return (
    <div className="card fuel-log">
      <h2>Diesel Fuel Log</h2>
      <p className="fuel-note">
        Log diesel prices as you fill up. There's no free live diesel-price
        feed by location, so entries are manual for now.
      </p>

      <div className="fuel-form">
        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <input
          type="text"
          name="location"
          placeholder="Station / city"
          value={form.location}
          onChange={handleChange}
        />
        <input
          type="number"
          step="0.001"
          name="pricePerGallon"
          placeholder="Price per gallon ($)"
          value={form.pricePerGallon}
          onChange={handleChange}
        />
        <input
          type="number"
          step="0.01"
          name="gallons"
          placeholder="Gallons"
          value={form.gallons}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>Add Entry</button>
      </div>

      <div className="fuel-summary">
        <span>Avg price/gal: ${avgPrice.toFixed(3)}</span>
        <span>Total spent: ${totalSpent.toFixed(2)}</span>
      </div>

      <div className="fuel-entries">
        {entries.length === 0 && <p className="empty-state">No fuel entries yet.</p>}
        {entries.map((entry) => (
          <div key={entry.id} className="fuel-entry">
            <div>
              <strong>{entry.date}</strong> — {entry.location}
            </div>
            <div>
              ${entry.pricePerGallon.toFixed(3)}/gal × {entry.gallons} gal = $
              {(entry.pricePerGallon * entry.gallons).toFixed(2)}
            </div>
            <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuelLog;
