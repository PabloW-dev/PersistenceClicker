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
            archetypeId: "protagonist",
            level: 1,
            hp: 50,
            speed: 20,
            damage: 50,
            dps: 10,
            activeSkill: "",
            state: "idle",

            target: null,
            path: [],
            pathIndex: 0,
            
            hitFlash: 0,
            spawning: true,
            spawnProgress: 0
        },
    });
}