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