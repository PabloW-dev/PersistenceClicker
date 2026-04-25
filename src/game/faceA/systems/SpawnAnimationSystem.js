//for animation of spawns
import worldState from "../../world/WorldState";

export default function spawnAnimationSystem(deltaTime) {
    worldState.entities.forEach(entity => {
        if (!entity.data?.spawning) return;

        entity.data.spawnProgress += deltaTime * 3; // velocidad

        if (entity.data.spawnProgress >= 1) {
            entity.data.spawnProgress = 1;
            entity.data.spawning = false;
        }
    });
}