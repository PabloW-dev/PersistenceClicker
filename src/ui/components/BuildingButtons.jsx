import React from 'react';
import { BUILDINGS } from '../../game/faceB/systems/BuildingsDefinition';
import { canShowButton, startBuildingMode } from '../../game/faceB/systems/ConstructionSystem';

export default function BuildingButtons() {
    const availableBuildings = BUILDINGS.filter(b => canShowButton(b.id));


  return (
    <>
      {availableBuildings.map(b => (
        <button 
            key={b.id}
            className="build-button" 
            onClick={() => startBuildingMode(b.id)}
        >
            {b.name}
        </button>
      ))}
    </>
  );
}
