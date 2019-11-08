import React from 'react';
import '../styles/select.css';

const BikeSelect = ({ bikes, currentBikeId, disabled, onChange }) => (
  <select
    className="outline-none focus:shadow-outline"
    disabled={disabled}
    onChange={onChange}
    value={currentBikeId || 'none'}
  >
    <option value="none">&lt;no bike&gt;</option>
    {bikes.map(bike => (
      <option key={bike.id} value={bike.id}>
        {bike.name}
      </option>
    ))}
  </select>
);

export default BikeSelect;
