import React, { useState } from 'react';
import './AddressInput.css';

const AddressInput = ({ onAddressChange, isLoaded }) => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleGeocode = () => {
    setError('');

    if (!isLoaded || !window.google || !window.google.maps) {
      setError('Map is still loading, please wait a moment and try again.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const location = results[0].geometry.location;
        onAddressChange({ lat: location.lat(), lng: location.lng() });
      } else {
        setError('Could not find that address.');
        console.error('Geocoding failed:', status);
      }
    });
  };

  return (
    <div className="address-input">
      <input
        type="text"
        value={address}
        onChange={handleInputChange}
        placeholder="Enter address"
      />
      <button onClick={handleGeocode} disabled={!isLoaded}>Geocode</button>
      {error && <p className="address-error">{error}</p>}
    </div>
  );
};

export default AddressInput;
