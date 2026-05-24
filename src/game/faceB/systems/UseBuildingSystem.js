//executer of the inside building action's
import worldState from "../../world/WorldState";

export function useBuildingSystem(deltaTime) {
    for (const entity of worldState.entities) {
        if(entity.type !== "villager") continue;

        entity.data.actionFlash = Math.max(
            0,
            entity.data.actionFlash - deltaTime * 8
        );

        //RESTING
        if(entity.data.actionType === "resting") {

            if(entity.data.path.length > 0) continue;

            const structure = entity.data.actionTarget;

            if(!structure) {
                entity.data.state = "idle";
                entity.data.actionType = null;
                continue;
            }

            // entrar
            if (!entity.data.hiddenInStructure) {
                entity.data.hiddenInStructure = true;
                entity.collider.radius = 0;
            }

            entity.data.hiddenTimer += deltaTime;

            // tick de descanso
            if(entity.data.hiddenTimer >= 1) {

                entity.data.energy = Math.min(
                    entity.data.energyMax,
                    entity.data.energy + 5
                );

                entity.data.hiddenTimer = 0;
            }

            // salir
            if(entity.data.energy >= entity.data.energyMax) {

                entity.data.hiddenInStructure = false;
                entity.collider.radius = 24;

                structure.data.reservedBy = null;

                entity.data.actionTarget = null;
                entity.data.actionType = null;
                entity.data.state = "idle";
            }

            continue;
        }

        //MANAGEMENT_RESOURCES
    }
}
