import React from 'react';
import { BUILDINGS } from '../../game/faceB/systems/BuildingsDefinition';
import { canShowButton, startBuildingMode } from '../../game/faceB/systems/ConstructionSystem';
import worldState from '../../game/world/WorldState';

export default function BuildingButtons() {
    const availableBuildings = BUILDINGS.filter(b => canShowButton(b.id));


  return (
    <>
      {availableBuildings.map(b => {

        const maxInWorld = worldState.structures.filter(s => s.data.referenceId === b.id).length >= b.maxInWorld;

        return (
          <button 
              key={b.id}
              className="process-button building" 
              disabled={maxInWorld}
              onClick={() => startBuildingMode(b.id)}
          >
              {b.name}
          </button>
        );
      })}
    </>
  );
}
