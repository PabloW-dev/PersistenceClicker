// clases de los edificios comunes del juego
// class of game's buildings
import Entity from "../../shared/Entity";
import { createSpecialOccupiedTiles } from "./SpecialBuildings";


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

            blockMovement: true,
            blockBuilding: true,

            scale: 1,

            state: "ghost",
            actionClick: "rest",
            actionDescription: "Villagers can use for rest, allowing them to regain energy",
            tileTypeForEmplacement: ["plain"],

            matsRequired,

            reservedBy: null,

            occupiedTiles: createSpecialOccupiedTiles(1)
        }
    }) 
}

export function createSilo(x, y, tileX, tileY, spriteType, matsRequired) {
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,

        tileX,
        tileY,

        type: "structure",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.75 },
            size: { w: 32, h: 48 }
        },

        collider: {
            radius: 24
        },

        data: {
            referenceId: "silo",
            
            hp: 1,
            hpMax: 25,

            blockMovement: true,
            blockBuilding: true,

            scale: 1,

            state: "ghost",
            actionClick: "store",
            actionDescription: "Villagers can use for storage materials",
            tileTypeForEmplacement: ["plain"],

            
            storage: {
                baseCapacity: 70,
                capacity: 70,
                freeSpace: 999,

                mode: "deposit",

                items: {

                }
            },      


            matsRequired,

            reservedBy: null,

            occupiedTiles: createSpecialOccupiedTiles(1)
        }
    }) 
}