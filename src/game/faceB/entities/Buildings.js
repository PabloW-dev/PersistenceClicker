// clases de los edificios comunes del juego
// class of game's buildings
import Entity from "../../shared/Entity";


export function createVillagerHouse(x, y, tileX, tileY, spriteType, matsRequired) {
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,

        tileX,
        tileY,

        type: "structure",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5 },
            size: { w: 32, h: 32 }
        },

        collider: {
            radius: 24
        },

        data: {
            referenceId: "villagerHouse",
            
            hp: 1,
            hpMax: 100,

            years: 0,

            blockMovement: true,
            blockBuilding: true,

            scale: 1,

            state: "ghost",
            actionClick: null,
            tileTypeForEmplacement: ["plain"],

            matsRequired,

            buildProgress: 0,
            buildTime: 30,

            reservedBy: null
        }
    }) 
}