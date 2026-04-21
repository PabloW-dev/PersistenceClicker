//movimiento, IA y habilidades de los enemigos

import worldState from "../../world/WorldState.js";
import gameState from "../../state/GameStateG.js";
import { emit } from "../../../utils/events.js";

export default function enemySystem(deltaTime, camera) {
    const tower = worldState.structures.find(s => s.type === "tower");

    worldState.entities.forEach(entity => {
        if (entity.type !== "enemy") return;

        //DIRECCIÓN A LA TORRE
        const dx = tower.x - entity.x;
        const dy = tower.y - entity.y;

        const dist = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));

        const nx = dx / dist;
        const ny = dy / dist;

        //MOVIMIENTO HASTA LA TORRE
        if (dist > entity.data.drainRadius) {
            entity.x += nx * entity.data.speed * deltaTime;
            entity.y += ny * entity.data.speed * deltaTime;
        }

        //RESET DEL FLASH
        if (entity.data.hitFlash > 0) {
            entity.data.hitFlash -= deltaTime;
        }

        //DRENAJE DE TIEMPO
        if (dist < entity.data.drainRadius) {
            const drain = entity.data.drainPerSecond * deltaTime;
            gameState.currentTime -= drain;

            entity.data.drainAccum = (entity.data.drainAccum || 0) + drain;
            entity.data.drainTextCooldown -= deltaTime;

            if (entity.data.drainTextCooldown <= 0) {
                
                emit("timeDrained", {
                    value: entity.data.drainAccum,
                    pos: camera.worldToScreen({ 
                        x: entity.x, 
                        y: entity.y 
                    })
                });

                entity.data.drainAccum = 0;
                entity.data.drainTextCooldown = 0.3;
            }
        }

        //SEPARACIÓN ENTRE ENEMIGOS
        worldState.entities.forEach(other => {
            if (other === entity) return;
            if (other.type !== "enemy") return;

            const dx = entity.x - other.x;
            const dy = entity.y - other.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            const minDist = 30; // distancia mínima entre enemigos

            if (dist > 0 && dist < minDist) {
                const force = 0.5;

                entity.x += (dx / dist) * force;
                entity.y += (dy / dist) * force;
            }
        });
    });
}