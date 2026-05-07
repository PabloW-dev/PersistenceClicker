//Creators for special Buildings
import Entity from "../../shared/Entity";


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
            size: { w: 64, h: 82 } //primera estructura que tiene que ocupar 4x4 tiles, eso hay que adaptarlo para que ocupe ese espacio de verdad
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType, //esto por si acaso, pero creo que no necesita nada más por ahora, a menos que para que ocupe 4x4 tiles haga falta darle alguna propiedad

            blockMovement: true,
            blockBuilding: true,

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
            size: { w: 64, h: 82 } //primera estructura que tiene que ocupar 4x4 tiles, eso hay que adaptarlo para que ocupe ese espacio de verdad
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType, //esto por si acaso, pero creo que no necesita nada más por ahora, a menos que para que ocupe 4x4 tiles haga falta darle alguna propiedad

            blockMovement: true,
            blockBuilding: true,

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
            size: { w: 64, h: 82 } //primera estructura que tiene que ocupar 4x4 tiles, eso hay que adaptarlo para que ocupe ese espacio de verdad
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType, //esto por si acaso, pero creo que no necesita nada más por ahora, a menos que para que ocupe 4x4 tiles haga falta darle alguna propiedad

            blockMovement: true,
            blockBuilding: true,

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
            size: { w: 64, h: 82 } //primera estructura que tiene que ocupar 4x4 tiles, eso hay que adaptarlo para que ocupe ese espacio de verdad
        },

        collider: {
            radius: 24
        },

        data: {
            spriteType, //esto por si acaso, pero creo que no necesita nada más por ahora, a menos que para que ocupe 4x4 tiles haga falta darle alguna propiedad

            blockMovement: true,
            blockBuilding: true,

            scale: 1,

            occupiedTiles: createSpecialOccupiedTiles(2)
        }
    });
}

function createSpecialOccupiedTiles(size) {
    const tiles = [];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            tiles.push({ x, y });
        }
    }

    return tiles;
}