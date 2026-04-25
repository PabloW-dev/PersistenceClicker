// detector de clicks
import worldState from "../../game/world/WorldState";
import { plusTime } from "../../game/faceA/LogicA.js";
import { plusExp } from "../../game/shared/Exp";
import { getEntityAtPosition } from "./ColliderSystem.js";
import { findPath } from "../../game/world/PathFinding.js";
import gameStateA from "../../game/faceA/state/GameStateA.js";
import gameState from "../../game/state/GameStateG.js";
import { canBeSelected, canReceiveOrders } from "../../utils/entitiesState.js"

function interactionSystem(worldPos) {

    const selected = worldState.entities.find(
        e => e.id === gameState.selectedEntityId
    );

    // STRUCTURES
    const structure = getEntityAtPosition(worldPos, worldState.structures);

    if (structure) {
        if (structure.type === "tower") {
            plusExp(0.1);
            plusTime(worldPos);

            gameStateA.hint.dismissed = true;
            gameStateA.hint.active = false;
        }

        gameState.selectedEntityId = null;
        return;
    }

    // ENTITIES
    const entity = getEntityAtPosition(worldPos, worldState.entities);

    if (entity) {
        if (entity.type === "archetype") {
            if (!canBeSelected(entity)) return;

            if (gameState.selectedEntityId === entity.id) return;
            gameState.selectedEntityId = entity.id;

            return;
        }

        if (entity.type === "shadow") {
            entity.data.clicks -= 1;

            entity.data.hitFlash = Math.max(entity.data.hitFlash, 0.15);

            if (entity.data.clicks <= 0) {
                worldState.entities = worldState.entities.filter(e => e.id !== entity.id);
            }
        }

        gameState.selectedEntityId = null;
        return;
    }

    // VACÍO → mover
    if (selected) {
        if(!canReceiveOrders(selected)) {
            gameState.selectedEntityId = null;
            return;
        }
        
        const grid = worldState.grid;

        const start = grid.worldToGrid({ x: selected.x, y: selected.y });
        const target = grid.worldToGrid(worldPos);

        selected.data.path = findPath(start, target, grid);
        selected.data.pathIndex = 0;
        selected.data.state = "moving";

        gameState.selectedEntityId = null;
    }
}

export default interactionSystem;