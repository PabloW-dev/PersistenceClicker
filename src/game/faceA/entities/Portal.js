// clases para los portales
// class for portals

import Entity from "../../shared/Entity.js";
import gameStateA from "../state/GameStateA.js";

function createPortal(x, y) {
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,
        type: "portal",

        sprite: {
            type: "portal",
            anchor: {
                x: 0.5,
                y: 0.5
            },
            size: { w: 64, h: 64 }
        },

        collider: {
            radius: 30
        },

        data: {
            hp: 1000 + ((gameStateA.portalLevel * 0.25) * 100),
            maxHp: 1000 + ((gameStateA.portalLevel * 0.25) * 100),
            level: gameStateA.portalLevel,
            spawnCooldown: 5,
            hitFlash: 0,
            timer: 0,
            spawnTimer: 0,
            spawning: true,
            spawnProgress: 0
        }
    });
}

export default createPortal;