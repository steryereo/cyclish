import React from 'react';

const BikeSelect = ({ bikes, currentBikeId, disabled, onChange }) => (
  <select disabled={disabled} onChange={onChange} value={currentBikeId || 'none'}>
    <option value="none">&lt;no bike&gt;</option>
    {bikes.map(bike => (
      <option key={bike.id} value={bike.id}>
        {bike.name}
      </option>
    ))}
  </select>
);

export default BikeSelect;
