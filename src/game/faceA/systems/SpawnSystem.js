// spawn de enemigos, escalado de dificultad, movimiento básico, vida/estado enemigos
//

import worldState from "../../world/WorldState";
import gameStateA from "../state/GameStateA";
import { createShadowEnemy } from "../entities/Shadow";
import { ARCHETYPES } from "./ArchetypeDefinition";
import { randomFrom } from "../../../utils/math";

const shadowSprites = ["shadowOne", "shadowTwo", "shadowThree", "shadowFour"];
const MAX_ENEMIES = 1000;

let spawmCounter = 0;

export default function spawnSystem(deltaTime) {
    let enemyCount = worldState.entities.filter(e => e.type === "shadow" || e.type === "enemy").length;

    for (const entity of worldState.entities) {
        if (entity.type !== "portal") continue;

        if (enemyCount >= MAX_ENEMIES) break;

        entity.data.spawnTimer += deltaTime;

        if (entity.data.spawnTimer < entity.data.spawnCooldown) continue;

        entity.data.spawnTimer = 0;

        spawnEnemyFromPortal(entity);
        enemyCount++;
    }
}

function spawnEnemyFromPortal(portal) {
    const angle = Math.random() * Math.PI * 2;
    const offset = 40;

    const x = portal.x + Math.cos(angle) * offset;
    const y = portal.y + Math.sin(angle) * offset;

    spawmCounter++;

    const unlocked = Object.keys(gameStateA.hasSummonedArchetypes)
        .filter(id => gameStateA.hasSummonedArchetypes[id]);

    const shouldSpawmEcho =
        spawmCounter % 4 === 0 &&
        unlocked.length > 0;

    if (shouldSpawmEcho) {
        const archetypeId = randomFrom(unlocked);
        const archetype = getArchetypeById(archetypeId);

        if (archetype?.echoFactory) {
            worldState.entities.push(
                archetype.echoFactory(x, y)
            );
            return;
        }
    }

    const spriteType = randomFrom(shadowSprites);

    worldState.entities.push(
        createShadowEnemy(x, y, spriteType)
    );
}

function getArchetypeById(id) {
    return ARCHETYPES.find(a => a.id === id);
}