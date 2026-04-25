import worldState from "../../game/world/WorldState";
import { canMove } from "../../utils/entitiesState.js"

const SPEED = 10;

export default function movementSystem(deltaTime) {
    const grid = worldState.grid;

    for (const entity of worldState.entities) {
        if (entity.type !== "archetype") continue;
        if (!canMove(entity)) continue;

        const path = entity.data.path;
        if (!path || path.length === 0) continue;

        const index = entity.data.pathIndex ?? 0;

        // end of path
        if (index >= path.length) {
            entity.data.state = "idle";
            entity.data.path = [];
            continue;
        }

        const nextCell = path[index];
        const targetPos = grid.gridToWorld(nextCell);

        const dx = targetPos.x - entity.x;
        const dy = targetPos.y - entity.y;

        const dist = Math.hypot(dx, dy);

        const move = SPEED * entity.data.speed * deltaTime;

        if (dist < 2) {
            // avanzar al siguiente nodo
            entity.data.pathIndex += 1;
            continue;
        }

        const dirX = dx / dist;
        const dirY = dy / dist;

        if (move >= dist) {
            entity.x = targetPos.x;
            entity.y = targetPos.y;
            entity.data.pathIndex += 1;
        } else {
            entity.x += dirX * move;
            entity.y += dirY * move;
        }
    }
}