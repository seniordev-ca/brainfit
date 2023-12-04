import './Trainstops.scss';
import React from 'react';

interface TrainstopsProps {
  numberOfStops: number;
  onClick?: (selectedStop: number) => void;
  activeStop: number;
}

export const Trainstops = function ({
  numberOfStops,
  onClick,
  activeStop,
  ...props
}: TrainstopsProps) {
  const stops = []

  function stopOnClick(index: number) {
    if (onClick) onClick(index)
  }

  for (let i = 0; i < numberOfStops; i++) {
    stops.push(<div key={`trainstop-${i}`} role='button' className={`trainstop ${activeStop === i ? 'active' : 'inactive'}`} onClick={() => stopOnClick(i)}></div>)
  }
  return (
    <div className="trainstops_container">
      {stops}
    </div>
  );
};
