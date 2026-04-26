// flujo de juego y funciones auxiliares de FaceA
// Game flow and auxiliary functions of FaceA

import gameState from "../state/GameStateG";
import worldState from "../world/WorldState";
import createProcess from "../../utils/process";
import { emit } from "../../utils/events";
import { getRandomSpawnPosition, isSpawnValid } from "../../utils/math";
import { archetypeScaling } from "../progression/ArchetypesScaling";

export function plusTime(worldPos, camera) {
    if (!gameState.gameStart || gameState.currentFace !== "A") return;

    gameState.currentTime += 0.5;

    emit("timeGained", {
        value: 0.5,
        pos: camera.worldToScreen(worldPos)
    });
}

export function startProcess(type, archetype) {
    
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
        pos = getRandomSpawnPosition(tower, 180, 220);
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