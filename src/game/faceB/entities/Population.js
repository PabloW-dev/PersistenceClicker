//population of B:

import Entity from "../../shared/Entity";

export function createVillager(x, y, spriteType) {
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,
        type: "villager",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5 },
            size: { w: 24, h: 30 }
        },

        collider: {
            radius: 24
        },

        data: {
            hp: 50,
            hpMax: 50,

            name: null,
            title: null,

            water: 100,
            age: 0,

            inventory: {

            },         
            
            actionCooldown: 4,
            actionTimer: 0,
            actionTarget: null,
            actionType: null,
            profExp: 0,
            proffesion: null,
            state: "idle",

            speed: 20,
            target: null,
            path: [],
            pathIndex: 0,
            movementType: "ground",

            hitFlash: 0,
            actionFlash: 0,
            spawning: true,
            spawnProgress: 0
        }
    });
}