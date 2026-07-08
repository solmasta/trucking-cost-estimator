import React, { useState } from 'react';
import './AddressInput.css';

const AddressInput = ({ onAddressChange }) => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleGeocode = async () => {
    setError('');
    if (!address.trim()) {
      setError('Please enter an address.');
      return;
    }

    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
      });
      const results = await response.json();

      if (results && results.length > 0) {
        onAddressChange({
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        });
      } else {
        setError('Could not find that address.');
      }
    } catch (err) {
      setError('Something went wrong looking up that address.');
      console.error('Geocoding failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-input">
      <input
        type="text"
        value={address}
        onChange={handleInputChange}
        placeholder="Enter address"
      />
      <button onClick={handleGeocode} disabled={loading}>
        {loading ? 'Searching...' : 'Geocode'}
      </button>
      {error && <p className="address-error">{error}</p>}
    </div>
  );
};

export default AddressInput;
