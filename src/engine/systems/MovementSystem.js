import worldState from "../../game/world/WorldState";
import { canMove } from "../../utils/entitiesState";
import { findPath, getNearestWalkableCell } from "../../game/world/PathFinding";
import { GroundMoveCost } from "../../game/world/Tile";

const SPEED = 10;


//TO DO: fix the pathfinding for can repath if there is a cell occupiedBy another entity

export default function movementSystem(deltaTime) {
    const grid = worldState.grid;

    for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
            const cell = grid.getCell(x, y);

            if (cell) {
                cell.occupiedBy = null;
            }
        }
    }

    const tower = worldState.structures.find(s => s.type === "tower");

    for (const entity of worldState.entities) {

        if (!canMove(entity)) continue;



        // ARCHETYPES
        if (entity.type === "archetype" || entity.type === "villager") {
            followPath(entity, grid, deltaTime);
            continue;
        }


        // enemies
        if (entity.type === "enemy") {
            handleEchoMovement(entity, grid, deltaTime, tower);
        }
    }

    applyEchoSeparation();
}

function handleEchoMovement(entity, grid, deltaTime, tower) {
    const combatTarget = entity.data.combatTarget;
    const target = combatTarget || tower;


    entity.data.repathTimer = Math.max(0, entity.data.repathTimer - deltaTime);

    // sin objetivo
    if (!target) {
        entity.data.state = "idle";
        entity.data.combatTarget = null;
        entity.data.path = [];
        entity.data.pathIndex = 0;
        entity.data.cachedTargetCell = null;
        entity.data.lastTargetRef = null;
        return;
    }

    const targetId = target.id ?? target.type;
    const targetChanged = entity.data.cachedTargetId !== targetId;

    const currentCell = grid.worldToGrid({
        x: entity.x,
        y: entity.y
    });

    //caché de cells
    let safeTargetCell = entity.data.cachedTargetCell;

    if (!safeTargetCell || targetChanged) {
        safeTargetCell = getNearestWalkableCell(target, grid);

        entity.data.cachedTargetCell = safeTargetCell;
        entity.data.lastTargetRef = target;
        entity.data.cachedTargetId = targetId;
    }


    //llegó al objetivo
    if (
        currentCell.x === safeTargetCell.x &&
        currentCell.y === safeTargetCell.y
    ) {
        entity.data.path = [];
        entity.data.pathIndex = 0;

        entity.data.lastTargetX = safeTargetCell.x;
        entity.data.lastTargetY = safeTargetCell.y;

        // estado lógico al llegar
        entity.data.state = "attacking";

        return;
    }

    const path = entity.data.path;
    const hasPath = path && path.length > 0;

    const cellTargetChanged = entity.data.lastTargetX !== safeTargetCell.x || entity.data.lastTargetY !== safeTargetCell.y;

    // SI NO HAY PATH → recalcular SIEMPRE
    const shouldRepath = 
        targetChanged ||
        (entity.data.repathTimer <= 0 && (!hasPath || cellTargetChanged));

    if(shouldRepath) {
        const newPath = findPath(currentCell, safeTargetCell, grid);

        entity.data.repathTimer = 0.5;

        if (newPath && newPath.length > 0) {
            entity.data.path = newPath;
            entity.data.pathIndex = 0;
            entity.data.lastTargetX = safeTargetCell.x;
            entity.data.lastTargetY = safeTargetCell.y;
        } else {
            // no bloquear IA si no hay path
            entity.data.repathTimer = 0.5;

            // cambia target cell para evitar stuck
            entity.data.cachedTargetCell = null;
            entity.data.lastTargetX = null;
            entity.data.lastTargetY = null;
            
            return;
        }
    }

    // estado
    entity.data.state = combatTarget
        ? "moving_to_combat"
        : "moving_to_tower";

    // mover
    followPath(entity, grid, deltaTime);
}

function followPath(entity, grid, deltaTime) {
    
    const path = entity.data.path;

    if (!path || path.length === 0) return;

    const currentCell = grid.worldToGrid({
        x: entity.x,
        y: entity.y
    });

    const currentGridCell = grid.getCell(
        currentCell.x,
        currentCell.y
    );

    if (currentGridCell) {
        currentGridCell.occupiedBy = entity.id;
    }

    const index = entity.data.pathIndex ?? 0;

    if (index >= path.length) {
        entity.data.path = [];
        entity.data.pathIndex = 0;

        if (entity.type === "villager") {

            if (
                entity.data.actionTarget?.data?.yearsToErase &&
                !entity.data.hiddenInStructure
            ) {
                entity.data.hiddenInStructure = true;
                entity.collider.radius = 0;
                entity.data.hiddenTimer = entity.data.actionCooldown * 3;
            }
            
            if (entity.data.actionType) {
                entity.data.state = entity.data.actionType;
            } else {
                entity.data.state = "idle";
            }

            return;
        }

        //idle
        if (!entity.data.combatTarget && entity.data.state !== "attacking") {
            entity.data.state = "idle";
        }

        return;
    }

    const nextCell = path[index];

    const occupied = grid.getCell(nextCell.x, nextCell.y)?.occupiedBy;

    if (occupied && occupied !== entity.id) {

        entity.data.blockedTimer =
            (entity.data.blockedTimer || 0) + deltaTime;

        if (entity.data.blockedTimer >= 2) {

            if (entity.data.actionTarget) {
                entity.data.actionTarget.data.reservedBy = null;
            }

            entity.data.path = [];
            entity.data.pathIndex = 0;
            entity.data.actionTarget = null;
            entity.data.actionType = null;
            entity.data.state = "idle";

            entity.data.blockedTimer = 0;
        }

        return;
    }

    entity.data.blockedTimer = 0;

    const next = grid.gridToWorld(path[index]);

    const dx = next.x - entity.x;
    const dy = next.y - entity.y;

    const dist = Math.hypot(dx, dy);

    let speedFactor = 1;

    if (entity.type === "villager") {
        speedFactor = Math.max(
            0.2,
            entity.data.energy / entity.data.energyMax
        );
    }

    const move = SPEED * entity.data.speed * speedFactor * deltaTime;

    if (dist < 2) {
        entity.data.pathIndex++;
        return;
    }

    const dirX = dx / dist;
    const dirY = dy / dist;

    if (move >= dist) {
        entity.x = next.x;
        entity.y = next.y;
        entity.data.pathIndex++;
    } else {
        entity.x += dirX * move;
        entity.y += dirY * move;
    }

    if (entity.type === "villager") {
        const currentCell = grid.worldToGrid({
            x: entity.x,
            y: entity.y
        });

        const tile = worldState.tileMap?.getTile(
            currentCell.x,
            currentCell.y
        );

        const moveCost = GroundMoveCost[tile?.groundType] ?? 1;

        if(!entity.data.lastStepCell) {
            entity.data.lastStepCell = currentCell;
        }

        if(
            currentCell.x !== entity.data.lastStepCell.x ||
            currentCell.y !== entity.data.lastStepCell.y
        ) {
            entity.data.steps++;

            entity.data.lastStepCell = currentCell;

            entity.data.movementFatigue +=
                moveCost * entity.data.energyDecay;

            while (entity.data.movementFatigue >= 5) {
                entity.data.energy = Math.max(
                    0,
                    entity.data.energy - 1
                );

                entity.data.movementFatigue = 0;
            }
            
        }
    }
}

function applyEchoSeparation() {
    const enemies = worldState.entities.filter(e => e.type === "enemy");

    const minDist = 24;
    const push = 0.4;

    for (const a of enemies) {
        for (const b of enemies) {
            if (a === b) continue;

            if (a.data.AsocArchRel !== b.data.AsocArchRel) continue;

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const dist = Math.hypot(dx, dy);

            if (dist > 0 && dist < minDist) {
                a.x += (dx / dist) * push;
                a.y += (dy / dist) * push;
            }
        }
    }
}