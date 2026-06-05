import React from 'react';
import { SPECIAL_BUILDINGS } from '../../game/faceB/systems/BuildingsDefinition';
import { canShowButton, startBuildingMode } from '../../game/faceB/systems/ConstructionSystem';
import gameStateA from '../../game/faceA/state/GameStateA';
import worldState from '../../game/world/WorldState';

export default function SpecialBuildingButtons() {
    const availableBuildings = SPECIAL_BUILDINGS.filter(b => canShowButton(b.id));

  return (
    <>
      {availableBuildings.map(b => {

        const maxInWorld = worldState.structures.filter(s => s.data.referenceId === b.id).length >= b.maxInWorld;

        return (
          <button
            id={`emplacement-${b.id}`}
            key={b.id}
            className={`
              process-button building
              ${
                gameStateA.hint.active &&
                gameStateA.hint.type === "dom" &&
                gameStateA.hint.targetId === `emplacement-${b.id}`
                  ? "tutorial-highlight"
                  : ""
              }
            `}
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
