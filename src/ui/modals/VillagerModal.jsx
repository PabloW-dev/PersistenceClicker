import React, { useState } from 'react'
import PropTypes from "prop-types";
import worldState from '../../game/world/WorldState';


VillagerModal.propTypes = {
    entityId: PropTypes.string.isRequired
};

export default function VillagerModal({ entityId }) {
    const entity = worldState.entities.find(e => e.id === entityId);
    const [name, setName] = useState(entity?.data.name || "");
    

    if(!entity) return null;

  return (
    <div
        className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}
    >
      <input
        className="modal-input"
        type="text"
        value={name}
        placeholder="Villager name..."

        onChange={(e) => setName(e.target.value)}

        onBlur={() => {
          entity.data.name = name.trim();
        }}

        onKeyDown={(e) => {
          if (e.key === "Enter") {
            entity.data.name = name.trim();

            e.target.blur();
          }
        }}
      />
      
      <p>Title: {entity?.data.title || "No title"}</p>
      <p>Proff: {entity?.data.proffesion || "No proff"}</p>
      <p>Speed: {entity.data.speed}</p>

      <p>HP: {entity.data.hp.toFixed(0)} / {entity.data.hpMax}</p>
      <p className={entity.data.water < 30 ? "warning-stat" : ""}>
        Water: {entity.data.water.toFixed(0)} / {entity.data.waterMax}
        </p>
      <p className={entity.data.food < 30 ? "warning-stat" : ""}>
        Hungry: {entity.data.food.toFixed(0)} / {entity.data.foodMax}
        </p>
      <p className={entity.data.energy < 30 ? "warning-stat" : ""}>
        Energy: {entity.data.energy.toFixed(0)} / {entity.data.energyMax}
      </p>
      <p>Age: {entity.data.age.toFixed(0)} / {entity.data.ageMax}</p>

      <p>Inventory: {
        Object.keys(entity.data.inventory.items).length > 0
            ? JSON.stringify(entity.data.inventory.items)
            : "Empty"
        }
      </p>
      <p>Capacity: {entity.data.inventory.carryCapacity}</p>
    </div>
  )
}
