import React from 'react';
import { SPECIAL_BUILDINGS } from '../../game/faceB/systems/BuildingsDefinition';
import { canShowButton, startBuildingMode } from '../../game/faceB/systems/ConstructionSystem';
import gameStateA from '../../game/faceA/state/GameStateA';

export default function SpecialBuildingButtons() {
    const availableBuildings = SPECIAL_BUILDINGS.filter(b => canShowButton(b.id));


  return (
    <>
      {availableBuildings.map(b => (
        <button
            id={`emplacement-${b.id}`}
            key={b.id}
            className={`
              process-button
              ${
                gameStateA.hint.active &&
                gameStateA.hint.type === "dom" &&
                gameStateA.hint.targetId === `emplacement-${b.id}`
                  ? "tutorial-highlight"
                  : ""
              }
            `}
            onClick={() => startBuildingMode(b.id)}
        >
            {b.name}
        </button>
      ))}
    </>
  );
}
