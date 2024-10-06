// HoverLabel.js
import React from 'react';
import './hover-label.css';

const HoverLabel = ({ name, position }) => {
  if (!name) return null;

  return (
    <div className="hover-label" style={{ top: position.y, left: position.x }}>
      {name}
    </div>
  );
};

export default HoverLabel;
