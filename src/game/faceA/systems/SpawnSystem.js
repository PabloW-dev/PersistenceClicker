// spawn de enemigos, escalado de dificultad, movimiento básico, vida/estado enemigos
//

import worldState from "../../world/WorldState";
import { createShadowEnemy } from "../entities/Enemy";
import { randomFrom } from "../../../utils/math";

const shadowSprites = ["shadowOne", "shadowTwo", "shadowThree", "shadowFour"];
const MAX_ENEMIES = 1000;

export default function spawnSystem(deltaTime) {
    const enemyCount = worldState.entities.filter(e => e.type === "enemy").length;

    if (enemyCount >= MAX_ENEMIES) return;

    worldState.entities.forEach(entity => {
        if (entity.type !== "portal") return;

        //acumular tiempo por portal
        entity.data.spawnTimer += deltaTime;

        if(entity.data.spawnTimer < entity.data.spawnCooldown) return;

        entity.data.spawnTimer = 0;

        if(enemyCount >= MAX_ENEMIES) return;

        spawnEnemyFromPortal(entity);
    });
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