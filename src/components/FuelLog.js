import React, { useState, useEffect } from 'react';
import './FuelLog.css';

const LOG_KEY = 'trucking-fuel-log';
const EIA_API_KEY = 'pR5T5cCJ9ND2mA04MmmIoB5XKsl8jSYy2qn1Hoi8';
// Midwest (PADD 2) weekly retail diesel price series - covers Illinois
const EIA_SERIES_URL = `https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=${EIA_API_KEY}&frequency=weekly&data[0]=value&facets[series][]=EMD_EPD2D_PTE_R20_DPG&sort[0][column]=period&sort[0][direction]=desc&length=1`;

const emptyEntry = { date: '', location: '', pricePerGallon: '', gallons: '' };

const FuelLog = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(LOG_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState(emptyEntry);
  const [regionalAvg, setRegionalAvg] = useState(null);
  const [regionalDate, setRegionalDate] = useState(null);
  const [avgError, setAvgError] = useState('');

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const fetchRegionalAverage = async () => {
      if (!EIA_API_KEY || EIA_API_KEY === 'YOUR_EIA_API_KEY_HERE') {
        setAvgError('Add your free EIA API key in FuelLog.js to show the regional average.');
        return;
      }
      try {
        const response = await fetch(EIA_SERIES_URL);
        const data = await response.json();
        const record = data?.response?.data?.[0];
        if (record && record.value !== undefined && record.value !== null) {
          const parsedValue = parseFloat(record.value);
          if (!isNaN(parsedValue)) {
            setRegionalAvg(parsedValue);
            setRegionalDate(record.period);
          } else {
            setAvgError('EIA returned an unexpected value.');
          }
        } else {
          setAvgError('Could not read regional average from EIA.');
        }
      } catch (err) {
        setAvgError('Could not reach EIA for the regional average.');
        console.error('EIA fetch failed:', err);
      }
    };
    fetchRegionalAverage();
  }, []);

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

      <div className="regional-avg-box">
        {regionalAvg !== null ? (
          <>
            <strong>Midwest regional avg: ${regionalAvg.toFixed(3)}/gal</strong>
            <span className="regional-avg-date">Week of {regionalDate} · Source: EIA</span>
          </>
        ) : (
          <span className="regional-avg-error">{avgError || 'Loading regional average...'}</span>
        )}
      </div>

      <p className="fuel-note">
        Log your own diesel prices as you fill up. There's no free live
        per-station lookup by GPS, so entries here are manual — the box
        above shows the free weekly regional average for comparison.
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
          name="price
