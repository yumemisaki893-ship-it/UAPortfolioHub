import React from 'react';
import './CbaBuilding.css';

const CbaBuilding = ({ navigateTo }) => (
  <div className="cba-building-hero">
    <div className="cba-building-content">
      <h1 className="cba-building-title">CBA Building</h1>
      <p className="cba-building-subtitle">
        Discover the architecture and facilities of the College of Business Administration.
      </p>
      <button
        className="btn btn-primary btn-lg-premium"
        onClick={() => navigateTo && navigateTo('directory')}
      >
        Explore Directory
      </button>
    </div>
  </div>
);

export default CbaBuilding;
