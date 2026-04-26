import worldState from "../../world/WorldState.js";
import gameState from "../../state/GameStateG.js";
import { emit } from "../../../utils/events.js";

export default function shadowSystem(deltaTime, camera) {
    const tower = worldState.structures.find(s => s.type === "tower");
    if (!tower) return;

    for (const entity of worldState.entities) {
        if (entity.type !== "shadow") continue;

        const dx = tower.x - entity.x;
        const dy = tower.y - entity.y;

        const dist = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));

        const nx = dx / dist;
        const ny = dy / dist;

        // MOVE
        const move = entity.data.speed * deltaTime;
        const stopDist = entity.data.drainRadius;

        if (dist > stopDist) {
            if (dist - move <= stopDist) {
                // clamp justo al borde del radio
                entity.x = tower.x - nx * stopDist;
                entity.y = tower.y - ny * stopDist;
            } else {
                entity.x += nx * move;
                entity.y += ny * move;
            }
        }

        // HIT FLASH
        if (entity.data.clickHitFlash > 0) {
            entity.data.clickHitFlash -= deltaTime;
        }

        // DRAIN
        if (dist < entity.data.drainRadius) {
            const drain = entity.data.drainPerSecond * deltaTime;
            gameState.currentTime -= drain;

            entity.data.drainAccum = (entity.data.drainAccum || 0) + drain;
            entity.data.drainTextCooldown -= deltaTime;

            if (entity.data.drainTextCooldown <= 0) {
                emit("timeDrained", {
                    value: entity.data.drainAccum,
                    pos: camera.worldToScreen({ x: entity.x, y: entity.y })
                });

                entity.data.drainAccum = 0;
                entity.data.drainTextCooldown = 0.3;
            }
        }

        // SIMPLE SEPARATION (NO GRID)
        for (const other of worldState.entities) {
            if (other === entity) continue;
            if (other.type !== "shadow") continue;

            const dx = entity.x - other.x;
            const dy = entity.y - other.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            const minDist = 28;

            if (dist > 0 && dist < minDist) {
                const push = 0.5;

                entity.x += (dx / dist) * push;
                entity.y += (dy / dist) * push;
            }
        }
    }
}