// clases para los enemigos del juego
// class for the game's enemies

import Entity from "../../shared/Entity";

export function createShadowEnemy(x, y, spriteType) {
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,
        type: "enemy",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5}
        },

        collider: {
            radius: 24
        },

        data: {
            clicks: 4,
            hp: 20,
            speed: 30,
            drainRadius: 40,
            drainPerSecond: 0.5,
            drainTextCooldown: 0,
            drainAccum: 0,
            hitFlash: 0
        }
    });
}

