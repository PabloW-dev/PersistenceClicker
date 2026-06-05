import { levelUpArchetype, spawnArchetype } from "../../game/faceA/LogicA";
import { ARCHETYPES } from "../../game/faceA/systems/ArchetypeDefinition";
import { applyUpgrade } from "../../game/progression/applyUpgrades";
import { LOGICIAN_UPGRADES } from "../../game/progression/LogicianUpgrades";
import gameState from "../../game/state/GameStateG";
import worldState from "../../game/world/WorldState";

export function restoreProcessCallbacks() {
    gameState.activeProcesses.forEach(process => {

        const archetype = ARCHETYPES.find(
            a => a.id === process.payload?.archetypeId
        );

        if(!archetype) return;

        if(process.type === "summon") {
            process.onComplete = () => spawnArchetype(archetype);
        }

        if(process.type === "levelup") {
            process.onComplete = () => levelUpArchetype(archetype); 
        }

        if(process.type === "investigate") {
            
            const upgradeId = process.payload?.upgradeId;

            const upgrade = LOGICIAN_UPGRADES.find(
                u => u.id === upgradeId
            );

            if (!upgrade) return;

            process.onComplete = () => applyUpgrade(archetype, upgrade);
        }

        if(process.type === "resurrect") {

            const entity = worldState.entities.find(
                e => 
                    e.type === "archetype" &&
                    e.data.archetypeId === archetype.id
            );

            if(!entity) return;

            const nextResurrection = entity.data.lastResurrection + 1;

            process.onComplete = () => {
                entity.data.hp = entity.data.maxHp || 50;
                entity.data.state = "idle";
                entity.data.lastResurrection = nextResurrection;
                entity.data.combatTarget = null;
                entity.data.combatOrigin = null;
            };
        }
    });
}