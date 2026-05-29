//functions of general logic
import gameState from "./state/GameStateG";
import { upgradeLogicianState } from "./progression/UpgradeState";
import worldState from "./world/WorldState";
import { ARCHETYPES } from "./faceA/systems/ArchetypeDefinition";


export function restTime(process) {
    
    if(!process || gameState.currentTime <= 0) return;

    process.progress += 1;

    gameState.currentTime -= 1;
    gameState.timeShakeTrigger = Date.now();
}

export function shouldShowArchetype(id) {
    const archetype = ARCHETYPES.find(a => a.id === id);
        
    if(!archetype) return false;
    
    return archetype.shouldShowArchetype(id);
}

export function shouldShowUpgrade(upgrade) {
    return !upgradeLogicianState.activeUpgrades.includes(upgrade.id);
}

export function getObjectInRadius(tileX, tileY, radius) {
    const found = [];

    for(let x = tileX - radius; x <= tileX + radius; x++) {
        for(let y = tileY - radius; y <= tileY + radius; y++) {
            const tile = worldState.tileMap.getTile(x, y);

            if(!tile) continue;

            if(tile.structureId) {
                const structure = worldState.structures.find(
                    s => s.id === tile.structureId
                );

                const scenographic = worldState.scenographics.find(
                    s => s.id === tile.structureId
                );

                if (structure) found.push(structure);
                if (scenographic) found.push(scenographic);
                
            }
        }
    }

    return found;
}

export function getStructureInRadius(tileX, tileY, radius, predicate = null) {
    const foundStructures = [];

    for(let x = tileX - radius; x <= tileX + radius; x++) {
        for(let y = tileY - radius; y <= tileY + radius; y++) {
            const tile = worldState.tileMap.getTile(x, y);

            if (!tile?.structureId) continue;

            const structure = worldState.structures.find(
                s => s.id === tile.structureId
            );

            if (!structure) continue;

            if (structure.type !== "structure") {
                continue;
            }

            if (predicate && !predicate(structure)) {
                continue;
            }

            foundStructures.push(structure);
        }
    }

    return foundStructures;
}