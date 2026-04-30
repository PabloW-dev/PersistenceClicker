import React from 'react';
import PropTypes from "prop-types";
import worldState from '../../game/world/WorldState';
import { ARCHETYPES } from '../../game/faceA/systems/ArchetypeDefinition';

ArchetypeModal.propTypes = {
    entityId: PropTypes.string.isRequired
};

export default function ArchetypeModal({ entityId }) {
    const entity = worldState.entities.find(e => e.id === entityId);

    const archetype = ARCHETYPES.find(a => a.id === entity.data.archetypeId);

    if(!entity) return null;

  return (
    <div
        className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}
    >
      <h2>{archetype?.name || "Archetype"}</h2>

      <p>Level: {entity.data.level}</p>
      <p>HP: {entity.data.hp} / {entity.data.maxHp}</p>
      <p>Damage: {entity.data.damage}</p>
      <p>Frecuency of hit: {entity.data.attackCooldown}</p>
      <p>Range: {entity.data.attackRange}</p>
      <p>Speed: {entity.data.speed}</p>
      <p>Defense: {entity.data.defense}</p>
      <p>Skill: {entity.data.activeSkill}</p>
    </div>
  )
}
