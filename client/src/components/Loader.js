import React from 'react';

import '../styles/loader.css';

const Loader = ({ className = '' }) => (
  <div className={`loader ${className}`}>
    <div />
    <div />
  </div>
);
export default Loader;
