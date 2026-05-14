// detector de clicks
import worldState from "../../game/world/WorldState";
import { upgradeLogicianState } from "../../game/progression/UpgradeState.js";
import { plusTime } from "../../game/faceA/LogicA.js";
import { plusExp } from "../../game/shared/Exp";
import { restEXPCanvas, addEXPToCenterTown } from "../../game/faceB/LogicB.js";
import { getEntityAtPosition } from "./ColliderSystem.js";
import { findPath, getNearestResourceCell, isAtTargetCell } from "../../game/world/PathFinding.js";
import gameStateA from "../../game/faceA/state/GameStateA.js";
import gameStateB from "../../game/faceB/state/GameStateB.js";
import gameState from "../../game/state/GameStateG.js";
import { placeBuilding, cancelBuildMode } from "../../game/faceB/systems/ConstructionSystem.js";
import { canBeSelected, canReceiveOrders } from "../../utils/entitiesState.js"
import { emit } from "../../utils/events.js";
import { POPULATION } from "../../game/faceB/systems/PopulationSystem.js"; 

function interactionSystem(worldPos, camera) {

    const selected = worldState.entities.find(
        e => e.id === gameState.selectedEntityId
    );

    if (gameStateB.buildMode.active) {

        const cell = worldState.grid.worldToGrid(worldPos);

        if (gameStateB.buildMode.canPlace) {
            placeBuilding(cell.x, cell.y);
        } else {
            cancelBuildMode();
        }

        return;
    }

    // SCENOGRAPHIQUES

    const scenographic = getEntityAtPosition(worldPos, worldState.scenographics);

    if (scenographic) {

        const villager = getEntityAtPosition(
            worldPos,
            worldState.entities.filter(e => e.type === "villager")
        );

        const workingVillager = getWorkingVillagerForScenographic(scenographic);

        const hasSelection = !!selected;

        if (
            !hasSelection &&
            workingVillager &&
            gameState.currentExp > 0
        ) {

            restEXPCanvas(worldPos, camera);
            if(scenographic.data?.yearsToErase) {
                workingVillager.data.hiddenTimer = Math.max(
                    0,
                    workingVillager.data.hiddenTimer - 1
                );
            } else {
                workingVillager.data.actionTimer += 1;
            }
            

            return;
        }

        if (villager) {
            if (!canBeSelected(villager)) return;

            gameState.selectedEntityId = villager.id;

            emit("openModal", {
                type: "villager",
                payload: {
                    entityId: villager.id
                }
            });

            return;
        }
        
        if (
            selected &&
            selected.type === "villager"
        ) {

            // ENERGÍA
            if (selected.data.energy < 10) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "energy";
                return;
            }

            // HAMBRE
            if (selected.data.food < 5) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "food";
                return;
            }

            // SED
            if (selected.data.water < 5) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "water";
                return;
            }

            // INVENTARIO LLENO
            if (selected.data.inventory.freeSpace <= 0) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "inventory";
                return;
            }

            // RESOURCE VACÍO
            if (scenographic.data.hp <= 0) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "resource";
                return;
            }

            // PROFESIÓN INCORRECTA
            if (!canDoJob(selected, scenographic)) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "profession";
                return;
            }

            //Ocupado
            if (scenographic.data.reservedBy && scenographic.data.reservedBy !== selected.id) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "reserved";
                return;
            }

            if (
                selected.data.actionTarget &&
                selected.data.actionTarget.id !== scenographic.id
            ) {
                selected.data.actionTarget.data.reservedBy = null;
            }

            selected.data.actionType = "obtaining_resources";
            selected.data.actionTarget = scenographic;
            console.log(selected.data.actionTarget);
            selected.data.state = "moving";
            scenographic.data.reservedBy = selected.id;
            console.log(selected);

            const grid = worldState.grid;

            const start = grid.worldToGrid({
                x: selected.x,
                y: selected.y
            });

            const target = getNearestResourceCell(
                scenographic,
                start,
                grid
            );

            if (isAtTargetCell(selected, target, grid)) {
                if (!canDoJob(selected, scenographic)) {
                    return;
                }

                //ocupado
                if (scenographic.data.reservedBy && scenographic.data.reservedBy !== selected.id) {
                    selected.data.warningFlash = 1;
                    selected.data.warningType = "reserved";
                    return;
                }

                selected.data.path = [];
                selected.data.pathIndex = 0;

                if (
                    selected.data.actionTarget &&
                    selected.data.actionTarget.id !== scenographic.id
                ) {
                    selected.data.actionTarget.data.reservedBy = null;
                }

                selected.data.actionType = "obtaining_resources";
                selected.data.actionTarget = scenographic;
                selected.data.state = "obtaining_resources";
                scenographic.data.reservedBy = selected.id;

                if(scenographic.data?.yearsToErase) {
                    selected.data.hiddenInStructure = true;
                    selected.collider.radius = 0;
                    selected.data.hiddenTimer = selected.data.actionCooldown * 3;
                }

                gameState.selectedEntityId = null;

                return;
            }

            const path = findPath(
                start,
                target,
                grid
            );

            if (!path || path.length <= 0) {

                scenographic.data.reservedBy = null;

                selected.data.actionTarget = null;
                selected.data.actionType = null;
                selected.data.state = "idle";

                return;
            }

            selected.data.path = path;
            selected.data.pathIndex = 0;
            gameState.selectedEntityId = null;
        }

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
            if (POPULATION.villagers.topPopulation) return;

            restEXPCanvas(worldPos, camera);
            addEXPToCenterTown(worldState);
        }

        const workingVillager = getWorkingVillagerForStructure(structure);

        const hasSelection = !!selected;

        if (
            !hasSelection &&
            workingVillager &&
            gameState.currentExp > 0 &&
            structure.data.state === "in_construction"
        ) {

            restEXPCanvas(worldPos, camera);
            workingVillager.data.actionTimer += 1;

            return;
        }

        if (structure.type === "structure" && !selected) {
            
            emit("openModal", {
                type: "structure",
                payload: {
                    structureId: structure.id
                }
            });

            return;
        }

        if (
            selected &&
            selected.type === "villager"
        ) {

            // ENERGÍA
            if (selected.data.energy < 20) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "energy";
                return;
            }

            // HAMBRE
            if (selected.data.food < 10) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "food";
                return;
            }

            // SED
            if (selected.data.water < 10) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "water";
                return;
            }

            // PROFESIÓN INCORRECTA
            if (!canDoJob(selected, scenographic)) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "profession";
                return;
            }

            //Ocupado
            if (structure.data.reservedBy && structure.data.reservedBy !== selected.id) {
                selected.data.warningFlash = 1;
                selected.data.warningType = "reserved";
                return;
            }

            if(structure.data.state === "emplacement") {
                const requiredMaterials = Object.keys(structure.data.matsRequired);

                const hasRequiredMaterials = requiredMaterials.some(
                    material =>
                        selected.data.inventory.items[material] > 0
                    );

                if (!hasRequiredMaterials) {
                    selected.data.warningFlash = 1;
                    selected.data.warningType = "inventory";
                    return;
                }

                if (
                    selected.data.actionTarget &&
                    selected.data.actionTarget.id !== structure.id
                ) {
                    selected.data.actionTarget.data.reservedBy = null;
                }


                selected.data.actionType = "delivering_resources";
                selected.data.actionTarget = structure;
                selected.data.state = "moving";
                console.log(selected);

                structure.data.reservedBy = selected.id;

                const grid = worldState.grid;

                const start = grid.worldToGrid({
                    x: selected.x,
                    y: selected.y
                });

                const target = getNearestResourceCell(
                    structure,
                    start,
                    grid
                );

                if (isAtTargetCell(selected, target, grid)) {
                    if (!canDoJob(selected, structure)) {
                        return;
                    }

                    //ocupado
                    if (structure.data.reservedBy && structure.data.reservedBy !== selected.id) {
                        selected.data.warningFlash = 1;
                        selected.data.warningType = "reserved";
                        return;
                    }

                    selected.data.path = [];
                    selected.data.pathIndex = 0;

                    if (
                        selected.data.actionTarget &&
                        selected.data.actionTarget.id !== structure.id
                    ) {
                        selected.data.actionTarget.data.reservedBy = null;
                    }

                    selected.data.actionType = "delivering_resources";
                    selected.data.actionTarget = structure;
                    selected.data.state = "delivering_resources";
                    structure.data.reservedBy = selected.id;

                    gameState.selectedEntityId = null;

                    return;
                }

                const path = findPath(
                    start,
                    target,
                    grid
                );

                if (!path || path.length <= 0) {

                    structure.data.reservedBy = null;

                    selected.data.actionTarget = null;
                    selected.data.actionType = null;
                    selected.data.state = "idle";

                    return;
                }

                selected.data.path = path;
                selected.data.pathIndex = 0;
                gameState.selectedEntityId = null;

                return;
            }

            if(structure.data.state === "in_construction") {
                
                
                if (
                    selected.data.actionTarget &&
                    selected.data.actionTarget.id !== structure.id
                ) {
                    selected.data.actionTarget.data.reservedBy = null;
                }


                selected.data.actionType = "building";
                selected.data.actionTarget = structure;
                selected.data.state = "moving";
                console.log(selected);

                structure.data.reservedBy = selected.id;

                const grid = worldState.grid;

                const start = grid.worldToGrid({
                    x: selected.x,
                    y: selected.y
                });

                const target = getNearestResourceCell(
                    structure,
                    start,
                    grid
                );

                if (isAtTargetCell(selected, target, grid)) {
                    if (!canDoJob(selected, structure)) {
                        return;
                    }

                    //ocupado
                    if (structure.data.reservedBy && structure.data.reservedBy !== selected.id) {
                        selected.data.warningFlash = 1;
                        selected.data.warningType = "reserved";
                        return;
                    }

                    selected.data.path = [];
                    selected.data.pathIndex = 0;

                    if (
                        selected.data.actionTarget &&
                        selected.data.actionTarget.id !== structure.id
                    ) {
                        selected.data.actionTarget.data.reservedBy = null;
                    }

                    selected.data.actionType = "building";
                    selected.data.actionTarget = structure;
                    selected.data.state = "building";
                    structure.data.reservedBy = selected.id;

                    gameState.selectedEntityId = null;

                    return;
                }

                const path = findPath(
                    start,
                    target,
                    grid
                );

                if (!path || path.length <= 0) {

                    structure.data.reservedBy = null;

                    selected.data.actionTarget = null;
                    selected.data.actionType = null;
                    selected.data.state = "idle";

                    return;
                }

                selected.data.path = path;
                selected.data.pathIndex = 0;
                gameState.selectedEntityId = null;

                return;
            }
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
                    ? "logician" : entity.type === "villager" 
                    ? "villager"
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

        if (selected.type === "villager") {

            if (selected.data.actionTarget) {
                selected.data.actionTarget.data.reservedBy = null;
            }

            selected.data.actionTarget = null;
            selected.data.actionType = null;
            selected.data.hiddenInStructure = false;
            selected.collider.radius = 24;
            selected.data.actionTimer = 0;
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

function getWorkingVillagerForScenographic(scenographic) { //find the villager that has gathering the scenographic
    return worldState.entities.find(entity =>
        entity.type === "villager" &&
        entity.data.actionTarget?.id === scenographic.id &&
        entity.data.path.length <= 0
    );
}

function getWorkingVillagerForStructure(structure) {
    return worldState.entities.find(entity =>
        entity.type === "villager" &&
        entity.data.actionTarget?.id === structure.id &&
        entity.data.path.length <= 0 &&
        entity.data.actionType === "building"
    );
}

function canDoJob(villager, scenographic) {

    const profession = villager.data.profession;

    // sin profesión → puede hacer cualquier cosa
    if (!profession) return true;

    // WOODS
    if (
        profession === "woodcutter" &&
        scenographic.data?.yearsForRebirth
    ) {
        return true;
    }

    // ROCKS
    if (
        profession === "stonecutter" &&
        scenographic.data?.yearsForRegenerate
    ) {
        return true;
    }

    // RUINS
    if (
        profession === "scavenger" &&
        scenographic.data?.yearsToErase
    ) {
        return true;
    }

    // cualquier otra combinación → prohibida
    return false;
}