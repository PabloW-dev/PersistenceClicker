import React from 'react';
import { SPECIAL_BUILDINGS } from '../../game/faceB/systems/BuildingsDefinition';
import { canShowButton, startBuildingMode } from '../../game/faceB/systems/ConstructionSystem';

export default function SpecialBuildingButtons() {
    const availableBuildings = SPECIAL_BUILDINGS.filter(b => canShowButton(b.id));


  return (
    <>
      {availableBuildings.map(b => (
        <button 
            key={b.id}
            className="process-button" 
            onClick={() => startBuildingMode(b.id)}
        >
            {b.name}
        </button>
      ))}
    </>
  );
}
