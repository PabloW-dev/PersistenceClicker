// clases para los recursos para construir y gestionar B
// classes for resources to build and manage B

import Entity from "../../shared/Entity";

export function createTree(x, y, tileX, tileY, species) {

    const state = "erased";

    const spriteType = state + species;
    
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,

        tileX,
        tileY,

        type: "resource",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.75},
            size: { w: 32, h: 48 }
        },

        collider: {
            radius: 24
        },

        data: {
            hp: 40,
            maxHp: 40,
            age: 0,
            maxYears: 100,
            years: 0,
            yearsForRebirth: 10,
            species,
            state,

            blockMovement: false,
            blockBuilding: true,

            hitflash: 0,

            scale: 1,
            targetScale: 1,
            isPreErasing: false,
            justChangedState: false
        }
    })
}

export function createRock(x, y, tileX, tileY, spriteType) { //las rocas y metales no van a tener sistema de decay así que no hace falta complicar los sprites
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,

        tileX,
        tileY,

        type: "resource",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.75},
            size: { w: 32, h: 20 }
        },

        collider: {
            radius: 24
        },

        data: {
            hp: 200,
            maxHp: 200,

            spriteType,
            
            years: 0,
            yearsForRegenerate: 100,

            depleted: false,

            blockMovement: true,
            blockBuilding: true,

            hitflash: 0,
            scale: 1
        }
    })
}

export function createRuin(x, y, tileX, tileY, spriteType) {
    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,

        tileX,
        tileY,

        type: "resource",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5},
            size: { w: 36, h: 36 }
        },

        collider: {
            radius: 24
        },

        data: {
            hp: 5, //por cada punto genera 1 de agua y PUEDE generar 1 de madera y 1 de piedra. Esto se traduce en que al scoutearla podrías conseguir 1 de cada, o 1 de agua y 1 de madera, o 1 de agua y 1 de piedra
            maxHp: 5,

            spriteType,
            
            years: 0,
            yearsToErase: 700, //esto en el propio sistema significa que 1 ruina dura 1 semana antes de derrumbarse definitivamente, si está scouteada o no da igual, la única manera de que no se erased resulta reconstruirla (y entonces ya entraría en el proceso de decay de los edificios)

            depleted: false, //esto no sé si va a hacer falta porque cuando el hp llegue a 0 va a resultar 0 y punto, así que if depleted resulta lo mismo que if hp 0 para manejar la lógica, además el proceso de decay de las ruins no depende del depleted

            blockMovement: true,
            blockBuilding: true,

            scale: 1
        }
    })
}