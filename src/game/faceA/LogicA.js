// flujo de juego y funciones auxiliares de FaceA
// Game flow and auxiliary functions of FaceA

import gameState from "../state/GameStateG";
import gameStateA from "./state/GameStateA";
import worldState from "../world/WorldState";
import createProcess from "../../utils/process";
import { emit } from "../../utils/events";
import { getRandomSpawnPosition, isSpawnValid } from "../../utils/math";
import { archetypeScaling } from "../progression/ArchetypesScaling";
import { ARCHETYPES } from "./systems/ArchetypeDefinition";
import { applyUpgrade } from "../progression/applyUpgrades";
import { upgradeLogicianState } from "../progression/UpgradeState";

export function plusTime(worldPos, camera) {
    if (!gameState.gameStart || gameState.currentFace !== "A") return;

    gameState.currentTime += 0.5 * upgradeLogicianState.clickMultiplier;

    emit("timeGained", {
        value: 0.5 * upgradeLogicianState.clickMultiplier,
        pos: camera.worldToScreen(worldPos)
    });
}

export function startProcess(type, archetype, upgrade) {
    
    let process = null;

    if(type === "summon") {
        process = createProcess({
            type,
            duration: archetype.summoningDuration,
            payload: {
                archetypeId: archetype.id
            },
            onComplete: () => spawnArchetype(archetype)
        });
    }

    if (type === "levelup") {
        const entity = worldState.entities.find(
            e => e.type === "archetype" && e.data.archetypeId === archetype.id
        );

        if(!entity) return;

        const currentLevel = entity.data.level;
        const nextLevel = currentLevel + 1;

        entity.data.state = "leveling";

        process = createProcess({
            type,
            duration: archetype.getLevelUpDuration(nextLevel),
            payload: {
                archetypeId: archetype.id
            },
            onComplete: () => levelUpArchetype(archetype)
        });
    }

    if (type === "investigate") {
        process = createProcess({
            type,
            duration: upgrade.duration,
            payload: {
                archetypeId: archetype.id,
                upgradeId: upgrade.id,
                type: "logician_upgrade"
            },
            onComplete: () => applyUpgrade(archetype, upgrade)
        });
    }

    gameState.activeProcesses.push(process);


    return process;
}

function spawnArchetype(archetype) {
    const tower = worldState.structures.find(s => s.type === "tower");
    const grid = worldState.grid;

    if (!tower) return;

    let pos;
    let attempts = 0;

    do {
        pos = getRandomSpawnPosition(tower, 140, 180);
        attempts++;
    } while (
        !isSpawnValid(pos.x, pos.y, tower, 150, grid) &&
        attempts < 50
    );

    const entity = archetype.factory(
        pos.x,
        pos.y,
        archetype.spriteType
    );

    worldState.entities.push(entity);

    if (!gameStateA.hasSummonedArchetypes[archetype.id]) {
        gameStateA.hasSummonedArchetypes[archetype.id] = true;
    }
}

function levelUpArchetype(archetype) {
    const entity = worldState.entities.find(
        e => e.type === "archetype" && e.data.archetypeId === archetype.id
    );

    if (!entity) return;

    entity.data.level += 1;

    const lvl = entity.data.level;

    const scaling = archetypeScaling[archetype.id];
    if (!scaling) return;

    entity.data.level = lvl;

    for (const key in scaling) {
        entity.data[key] = scaling[key](lvl);
    }

    entity.data.state = "active";
}

export function startResurrectProcess(entity) {
    const archetypeId = entity.data.archetypeId;
    const archetype = ARCHETYPES.find(a => a.id === archetypeId);
    if(!archetype) return;

    const nextResurrection = entity.data.lastResurrection + 1;

    const alreadyHasProcess = gameState.activeProcesses.some(
    p => p.payload?.archetypeId === archetypeId && p.type === "resurrect"
    );

    if (alreadyHasProcess) return;

    const process = createProcess({
        type: "resurrect",
        duration: archetype.getCurrentResurrectionDuration(nextResurrection),
        payload: { archetypeId },
        onComplete: () => {
            entity.data.hp = entity.data.maxHp || 50;
            entity.data.state = "idle";
            entity.data.lastResurrection = nextResurrection;
            entity.data.combatTarget = null;
            entity.data.combatOrigin = null;
            // limpiar flags visuales si quieres
        }
    });

    gameState.activeProcesses.push(process);
}