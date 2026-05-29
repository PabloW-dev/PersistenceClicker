import React from 'react';
import PropTypes from "prop-types";
import worldState from '../../game/world/WorldState';
import { emit } from '../../utils/events';
import { changeToA } from '../../engine/scenes/SceneManager';
import gameState from '../../game/state/GameStateG';
import { startSceneTransition } from '../../engine/scenes/TransitionManager';


BuildingModal.propTypes = {
    structureId: PropTypes.string.isRequired
};

export default function BuildingModal({ structureId }) {
  const structure = worldState.structures.find(s => s.id === structureId);

  if(!structure) return null;

  const entity = worldState.entities.find(e => e.id === structure.data.reservedBy);
  

  return (
    <div
        className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}
    >
      <p>{structure.data.referenceId}</p>
      <p>HP: {structure.data.hp.toFixed(0)} / {structure.data.hpMax}</p>
      <p>Use: {structure.type === "structure"
                ? structure.data.actionDescription
                : "Special"}</p>
      {structure.type === "structure" && (
        <p>
          Inside: {entity?.data?.name || (entity ? "Villager" : "Nobody")}
        </p>)}
      {structure.data.state === "emplacement" && (
        <div>
          <p>Required materials:</p>

          {Object.keys(structure.data.matsRequired).length > 0
            ? JSON.stringify(structure.data.matsRequired)
            : "Ready"
          }
        </div>
      )}
      {structure.data.storage && (<div>
          <button
            className="process-button"
            onClick={() => {
              structure.data.storage.mode =
                structure.data.storage.mode === "deposit"
                  ? "withdraw"
                  : "deposit";
            }}
          >
            Switch to {
              structure.data.storage.mode === "deposit"
                ? "Withdraw"
                : "Deposit"
            }
          </button>

          <p>Storage materials: {
            Object.keys(structure.data.storage.items).length > 0
              ? JSON.stringify(structure.data.storage.items)
              : "Empty"
            }
          </p>
        </div>)}

      {gameState.currentFace === "B" && structure.id === "sundial" && structure.data.state === "build" && (
        <div>
          <p>Are you sure you want to come back?</p>

          <button className="process-button" onClick={() => {
            if(gameState.currentFace !== "B") return; 
            
            startSceneTransition(changeToA())
            }}>
            Yes
          </button>

          <button className="process-button" onClick={
            () => 
              emit("closeModal")
            }>
            No
          </button>
        </div>
      )}
    </div>
  )
}
