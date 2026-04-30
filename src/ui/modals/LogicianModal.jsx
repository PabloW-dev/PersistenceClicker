import React from 'react';
import PropTypes from "prop-types";
import worldState from '../../game/world/WorldState';
import { ARCHETYPES } from '../../game/faceA/systems/ArchetypeDefinition';
import { startProcess } from "../../game/faceA/LogicA";
import { LOGICIAN_UPGRADES } from "../../game/progression/LogicianUpgrades";
import { emit } from "../../utils/events";
import { shouldShowUpgrade } from '../../game/LogicG';
import { upgradeLogicianState } from "../../game/progression/UpgradeState";

LogicianModal.propTypes = {
    entityId: PropTypes.string.isRequired
};

function handleInvestigate(upgrade, entity) {
    if (entity.data.state === "investigating") return;

    entity.data.state = "investigating";

    emit("closeModal");

    startProcess("investigate", entity, upgrade);
}

export default function LogicianModal({ entityId }) {
    const entity = worldState.entities.find(e => e.id === entityId);

    const archetype = ARCHETYPES.find(a => a.id === entity.data.archetypeId);
    
    if(!entity) return null;

    

  return (
    <div
        className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}
    >
      <h2>{archetype?.name || "The Logician"}</h2>

      <p>Level: {entity.data.level}</p>
      <p>HP: {entity.data.hp} / {entity.data.maxHp}</p>

      {LOGICIAN_UPGRADES
        .filter(u => shouldShowUpgrade(u, entity))
        .map(upgrade => (
            <button
                key={upgrade.id}
                onClick={() => handleInvestigate(upgrade, entity)}
            >
                {upgrade.name}
            </button>
        ))}

        <div className="active-upgrades">
        {upgradeLogicianState.activeUpgrades.map(id => {
            const upgrade = LOGICIAN_UPGRADES.find(u => u.id === id);
            if (!upgrade) return null;

            return (
                <p key={id}>
                    {upgrade.name}
                </p>
            ); //TODO: change the p for a img and make a submodal for upgrade information, and do it by a map, not by a find
        })}
        </div>
    </div>
  )
}
