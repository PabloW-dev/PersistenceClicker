import React from 'react';
import PropTypes from "prop-types";
import worldState from '../../game/world/WorldState';


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
      <p>HP: {structure.data.hp} / {structure.data.hpMax}</p>
      <p>Years: {structure.data.years} / {structure.data.yearsToRuin}</p>
      <p>Use: {structure.data.actionClick}</p>
      <p>
        Inside: {entity?.data?.name || (entity ? "Villager" : "Nobody")}
      </p>
      {structure.data.state === "emplacement" && (
        <div>
          <p>Required materials:</p>

          {Object.keys(structure.data.matsRequired).length > 0
            ? JSON.stringify(structure.data.matsRequired)
            : "Ready"
          }
        </div>
      )}
    </div>
  )
}
