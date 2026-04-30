// sistema de combate automático
// cálculo de velocidad diferente a movementSystem
import gameState from "../../state/GameStateG";
import worldState from "../../world/WorldState";
import { canAct } from "../../../utils/entitiesState";
import { startResurrectProcess } from "../LogicA";

const MAX_CHASE_DISTANCE = 200;

export default function combatSystem(deltaTime) {
    const entities = worldState.entities;
    const structures = worldState.structures;

    for (const entity of entities) {
        if (entity.data?.hitFlash > 0) {
            entity.data.hitFlash = Math.max(0, entity.data.hitFlash - deltaTime);
        }

        if (entity.data?.attackFlash > 0) {
            entity.data.attackFlash = Math.max(0, entity.data.attackFlash - deltaTime);
        }

        // solo combatientes
        if (!entity.data || !entity.data.canFight) continue;

        // archetypes no actúan si se mueven
        if (!canAct(entity)) {
            entity.data.combatTarget = null;
            entity.data.combatOrigin = null;
            continue;
        }

        // cooldown
        entity.data.attackTimer = Math.max(0, entity.data.attackTimer - deltaTime);

        // limpiar target inválido o muerto
        if (
            entity.data.combatTarget &&
            (
                !entity.data.combatTarget.data ||
                entity.data.combatTarget.data.hp <= 0 ||
                entity.data.combatTarget.data.state === "dead"
            )
        ) {
            entity.data.combatTarget = null;
            entity.data.combatOrigin = null;
        }

        // buscar target
        if (!entity.data.combatTarget) {
            entity.data.combatTarget = findTarget(entity, entities, structures);

            if (entity.data.combatTarget) {
                entity.data.combatOrigin = {
                    x: entity.x,
                    y: entity.y
                };
            }
        }

        // si no hay target → idle
        if(entity.type === "archetype") {
            if (!entity.data.combatTarget) {
                entity.data.state = "idle";
                continue;
            }
        }

        const target = entity.data.combatTarget;

        if (!target) continue;

        const dx = target.x - entity.x;
        const dy = target.y - entity.y;
        const dist = Math.hypot(dx, dy);

        const range = 
            entity.data.attackRangeOverrides?.[target.type] ??
            entity.data.attackRange;

        if (dist <= range) {
            entity.data.state = "attacking";

            if (canAttack(entity, target, dist)) {
                applyDamage(entity, target);
                entity.data.attackTimer = entity.data.attackCooldown;

                if (target.data.hp <= 0) {
                    handleDeath(target);
                    entity.data.combatTarget = null;
                    entity.data.combatOrigin = null;
                }
            }

            continue;
        }

        // límite de persecución
        if (!entity.data.combatOrigin) {
            entity.data.combatOrigin = { x: entity.x, y: entity.y };
        }
        const dxOrigin = entity.x - entity.data.combatOrigin.x;
        const dyOrigin = entity.y - entity.data.combatOrigin.y;
        const distFromOrigin = Math.hypot(dxOrigin, dyOrigin);

        if (distFromOrigin > MAX_CHASE_DISTANCE) {
            entity.data.combatTarget = null;
            entity.data.combatOrigin = null;
            if(entity.type === "archetype") {
                entity.data.state = "idle";
            }
            continue;
        }

        if(entity.type === "archetype") {
            // perder target si se sale de visión
            if (dist > entity.data.visionRange * 1.2) {
                entity.data.combatTarget = null;
                entity.data.combatOrigin = null;
                entity.data.state = "idle";
                continue;
            }

            // moverse hacia target
            if (dist > entity.data.attackRange) {
                const dirX = dx / dist;
                const dirY = dy / dist;

                const speed = (entity.data.speed || 20) * 5;

                entity.x += dirX * speed * deltaTime;
                entity.y += dirY * speed * deltaTime;

                continue;
            }
        }

        // atacar
        entity.data.state = "attacking";

        if (canAttack(entity, target, dist)) {
            applyDamage(entity, target);
            entity.data.attackTimer = entity.data.attackCooldown;

            if (target.data.hp <= 0) {
                handleDeath(target);
                entity.data.combatTarget = null;
                entity.data.combatOrigin = null;
            }
        }
    }
}

function findTarget(entity, entities, structures) {
    const isEnemy = entity.type === "enemy";
    const isArchetype = entity.type === "archetype";

    let best = null;
    let bestDist = Infinity;

    const candidates = [...entities, ...structures];

    for (const other of candidates) {
        if (other === entity) continue;
        if (other.data.hp <= 0 || other.data.state === "dead") continue;
        if (!other.data || other.data.hp == null) continue;

        // enemigos no atacan enemigos, sombras ni portales
        if (isEnemy && (other.type === "enemy" || other.type === "shadow" || other.type === "portal")) continue;

        // archetypes no atacan aliados
        if (isArchetype && (other.type === "tower" || other.type === "archetype" || other.type === "friendStructure")) continue;

        const dx = other.x - entity.x;
        const dy = other.y - entity.y;
        const dist = Math.hypot(dx, dy);

        if (dist > entity.data.visionRange) continue;

        if (dist < bestDist) {
            bestDist = dist;
            best = other;
        }
    }

    return best;
}

function handleDeath(entity) {

    if (
        entity.type === "enemy" ||
        entity.type === "shadow" ||
        entity.type === "portal"
    ) {
        worldState.entities = worldState.entities.filter(e => e.id !== entity.id);
        return;
    }

    if (entity.type === "archetype") {
        if (entity.data.state === "dead") return;

        entity.data.state = "dead";

        cancelProcessesByArchetype(entity.data.archetypeId);

        startResurrectProcess(entity);

        return;
    }

    if (entity.type === "tower") {
        console.log("GAME OVER");
        return;
    }
}

function applyDamage(attacker, target) {
    const damage = attacker.data.damage || 0;
    const defense = target.data.defense || 0;

    const finalDamage = Math.max(1, damage - defense);
    //finalDamage = damage * (100 / (100 + defense))

    target.data.hp -= finalDamage;
    target.data.hp = Math.max(0, target.data.hp);

    target.data.hitFlash = Math.max(
        target.data.hitFlash || 0,
        0.15
    );

    // feedback del que ataca (placeholder)
    attacker.data.attackFlash = Math.max(
        attacker.data.attackFlash || 0,
        0.12
    );
}

function canAttack(entity, target, dist) {
    if (!target) return false;
    if (entity.data.attackTimer > 0) return false;
    if (target.data.hp <= 0) return false;

    const range =
        entity.data.attackRangeOverrides?.[target.type] ??
        entity.data.attackRange;

    return dist <= range;
}

function cancelProcessesByArchetype(archetypeId) {
    gameState.activeProcesses.forEach(p => {
        if (p.payload?.archetypeId === archetypeId) {
            p.state = "cancelled";
        }
    });
}