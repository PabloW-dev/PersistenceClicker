//enemies

import Entity from "../../shared/Entity";

export function createEchoProtagonist(x, y, spriteType) {
    return new Entity ({
        id: crypto.randomUUID(),
        x,
        y,
        type: "enemy",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5 }
        },

        collider: {
            radius: 24
        },

        data: {
            AsocArchRel: "protagonist",
            level: 1,
            hp: 50,
            speed: 10,
            damage: 10,
            attackRange: 25,
            attackRangeOverrides: {
                tower: 120
            },
            canFight: true,
            visionRange: 120,
            attackCooldown: 4,
            attackTimer: 0,
            combatTarget: null,
            combatOrigin: null,
            activeSkill: null,
            state: "spawning",

            target: null,
            lastTargetX: null,
            lastTargetY: null,
            path: [],
            pathIndex: 0,
            cachedTargetCell: null,
            lastTargetRef: null,
            cachedTargetId: null,
            repathTimer: 0,
            movementType: "ground",

            
            hitFlash: 0,
            attackFlash: 0,
            spawning: true,
            spawnProgress: 0
        },
    });
}