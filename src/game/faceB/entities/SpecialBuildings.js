//Creators for special Buildings
import Entity from "../../shared/Entity";

//TO DO: arreglar el overlay que va a molestar para las estatuas

export function createSundial(x, y, tileX,tileY, spriteType, matsRequired) {
    return new Entity({
        id: "sundial",
        x,
        y,

        tileX,
        tileY,

        type: "special",

        sprite: {
            type: spriteType,
            anchor: { x: 0.25, y: 0.25 },
            size: { w: 64, h: 64 }
        },

        collider: {
            radius: 30
        },

        data: {
            referenceId: "sundial",

            hp: 1,
            hpMax: 250,

            spriteType,

            blockMovement: true,
            blockBuilding: true,

            onlyOne: true,

            scale: 1,

            state: "ghost",
            tileTypeForEmplacement: ["centerRing"],

            matsRequired,

            buildProgress: 0,
            buildTime: 30,

            occupiedTiles: createSpecialOccupiedTiles(2)
        }
    })
}


export function createProtagonistStatue(x, y, tileX, tileY, spriteType) {
    return new Entity({
        id: "protagonist",
        x,
        y,

        tileX,
        tileY,

        type: "special",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.75},
            size: { w: 64, h: 82 }
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType,

            hp: 250,
            hpMax: 250,

            blockMovement: true,
            blockBuilding: true,

            onlyOne: true,

            scale: 1,

            occupiedTiles: createSpecialOccupiedTiles(2)
        }
    });
}

export function createLogicianStatue(x, y, tileX, tileY, spriteType) {
    return new Entity({
        id: "logician",
        x,
        y,

        tileX,
        tileY,

        type: "special",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.75},
            size: { w: 64, h: 82 }
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType,

            hp: 250,
            hpMax: 250,

            blockMovement: true,
            blockBuilding: true,

            onlyOne: true,

            scale: 1,

            occupiedTiles: createSpecialOccupiedTiles(2)
        }
    });
}

export function createLogisticianStatue(x, y, tileX, tileY, spriteType) {
    return new Entity({
        id: "logistician",
        x,
        y,

        tileX,
        tileY,

        type: "special",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.75},
            size: { w: 64, h: 82 }
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType,

            hp: 250,
            hpMax: 250,

            blockMovement: true,
            blockBuilding: true,

            onlyOne: true,

            scale: 1,

            occupiedTiles: createSpecialOccupiedTiles(2)
        }
    });
}

export function createDefenderStatue(x, y, tileX, tileY, spriteType) {
    return new Entity({
        id: "defender",
        x,
        y,

        tileX,
        tileY,

        type: "special",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.75},
            size: { w: 64, h: 82 }
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType,

            hp: 1,
            hpMax: 250,

            blockMovement: true,
            blockBuilding: true,

            onlyOne: true,

            scale: 1,

            occupiedTiles: createSpecialOccupiedTiles(2)
        }
    });
}

export function createSpecialOccupiedTiles(size) {
    const tiles = [];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            tiles.push({ x, y });
        }
    }

    return tiles;
}