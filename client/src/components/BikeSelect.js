import React from 'react';

const BikeSelect = ({ activity, bikes, onChange, disabled }) => (
  <select
    disabled={disabled}
    onChange={e => onChange(e, activity)}
    value={activity.gear_id || 'none'}
  >
    <option value="none">none</option>
    {bikes.map(bike => (
      <option key={bike.id} value={bike.id}>
        {bike.name}
      </option>
    ))}
  </select>
);

export default BikeSelect;
