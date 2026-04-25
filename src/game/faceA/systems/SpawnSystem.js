// spawn de enemigos, escalado de dificultad, movimiento básico, vida/estado enemigos
//

import worldState from "../../world/WorldState";
import { createShadowEnemy } from "../entities/Shadow";
import { randomFrom } from "../../../utils/math";

const shadowSprites = ["shadowOne", "shadowTwo", "shadowThree", "shadowFour"];
const MAX_ENEMIES = 1000;

export default function spawnSystem(deltaTime) {
    let enemyCount = worldState.entities.filter(e => e.type === "shadow").length;

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
    const spriteType = randomFrom(shadowSprites);

    //spawn cerca del portal
    const angle = Math.random() * Math.PI * 2;
    const offset = 40;

    const x = portal.x + Math.cos(angle) * offset;
    const y = portal.y + Math.sin(angle) * offset;

    worldState.entities.push(
        createShadowEnemy(x, y, spriteType)
    );

    console.log("spriteType:", spriteType);
}