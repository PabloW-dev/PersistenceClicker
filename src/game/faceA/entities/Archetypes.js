// classes para los items del juego
// class for the game's items

import Entity from "../../shared/Entity";

export function createTheProtagonist(x, y, spriteType) {
    return new Entity ({
        id: "protagonist",
        x,
        y,
        type: "archetype",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5 }
        },

        collider: {
            radius: 24
        },

        data: {
            isBusy: false,

            archetypeId: "protagonist",
            level: 1,
            hp: 50,
            maxHp: 50,
            speed: 15,
            canFight: true,
            damage: 50,
            defense: 5,
            attackRange: 25,
            visionRange: 120,
            attackCooldown: 4,
            attackTimer: 0,
            combatTarget: null,
            combatOrigin: null,
            activeSkill: null,
            state: "idle",

            target: null,
            path: [],
            pathIndex: 0,
            movementType: "ground",
            
            hitFlash: 0,
            attackFlash: 0,
            spawning: true,
            spawnProgress: 0,
            spawnHighlightStart: 0,

            lastResurrection: 0
        },
    });
}

export function createTheLogician(x, y, spriteType) {
    return new Entity ({
        id: "logician",
        x,
        y,
        type: "archetype",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5 }
        },

        collider: {
            radius: 24
        },

        data: {
            isBusy: false,

            archetypeId: "logician",
            level: 1,
            hp: 50,
            maxHp: 50,
            speed: 15,
            canFight: false,
            damage: 0,
            defense: 5,
            attackRange: 0,
            visionRange: 0,
            attackCooldown: 0,
            attackTimer: 0,
            combatTarget: null,
            combatOrigin: null,
            activeSkill: null,
            state: "idle",

            target: null,
            path: [],
            pathIndex: 0,
            movementType: "ground",
            
            hitFlash: 0,
            attackFlash: 0,
            spawning: true,
            spawnProgress: 0,
            spawnHighlightStart: 0,

            lastResurrection: 0
        },
    });
}

export function createTheLogistician(x, y, spriteType) {
    return new Entity ({
        id: "logistician",
        x,
        y,
        type: "archetype",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5 }
        },

        collider: {
            radius: 24
        },

        data: {
            isBusy: false,
            
            archetypeId: "logistician",
            level: 1,
            hp: 30,
            maxHp: 30,
            speed: 15,
            canFight: true,
            damage: 25,
            defense: 1,
            attackRange: 180,
            visionRange: 180,
            attackType: "projectile",
            projectileSpeed: 120,
            attackCooldown: 3,
            attackTimer: 0,
            combatTarget: null,
            combatOrigin: null,
            activeSkill: null,
            state: "idle",

            target: null,
            path: [],
            pathIndex: 0,
            movementType: "ground",
            
            hitFlash: 0,
            attackFlash: 0,
            spawning: true,
            spawnProgress: 0,
            spawnHighlightStart: 0,

            lastResurrection: 0
        },
    });
}