// detector de clicks
import worldState from "../../game/world/WorldState";
import { upgradeLogicianState } from "../../game/progression/UpgradeState.js";
import { plusTime } from "../../game/faceA/LogicA.js";
import { plusExp } from "../../game/shared/Exp";
import { restEXPCanvas, addEXPToCenterTown } from "../../game/faceB/LogicB.js";
import { getEntityAtPosition } from "./ColliderSystem.js";
import { findPath } from "../../game/world/PathFinding.js";
import gameStateA from "../../game/faceA/state/GameStateA.js";
import gameState from "../../game/state/GameStateG.js";
import { canBeSelected, canReceiveOrders } from "../../utils/entitiesState.js"
import { emit } from "../../utils/events.js";

function interactionSystem(worldPos, camera) {

    const selected = worldState.entities.find(
        e => e.id === gameState.selectedEntityId
    );

    // SCENOGRAPHIQUES

    const scenographic = getEntityAtPosition(worldPos, worldState.scenographics);

    if (scenographic) {
        gameState.selectedEntityId = null;
        return;
    }

    // STRUCTURES
    const structure = getEntityAtPosition(worldPos, worldState.structures);

    if (structure) {
        if (structure.type === "tower") {
            plusExp(0.1 * upgradeLogicianState.clickMultiplier);
            plusTime(worldPos, camera);

            gameStateA.hint.dismissed = true;
            gameStateA.hint.active = false;
        }


        if (structure.type === "centerTown") {
            
            if (gameState.currentExp <= 0) return;

            restEXPCanvas(worldPos, camera);
            addEXPToCenterTown(worldState);
        }

        gameState.selectedEntityId = null;
        return;
    }

    // ENTITIES
    const entity = getEntityAtPosition(worldPos, worldState.entities);

    if (entity) {
        if (entity.type === "archetype" || entity.type === "villager") {
            if (!canBeSelected(entity)) return;

            if (gameState.selectedEntityId === entity.id) return;
            gameState.selectedEntityId = entity.id;

            emit("openModal", {
                type: entity.id === "logician"
                    ? "logician"
                    : "archetype",
                payload: {
                    entityId: entity.id
                }
            });

            return;
        }

        if (entity.type === "shadow") {
            entity.data.clicks -= 1;

            entity.data.clickHitFlash = Math.max(entity.data.clickHitFlash, 0.15);

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