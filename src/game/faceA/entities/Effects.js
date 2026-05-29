//graphics for proyectiles, auras, etc

import Entity from "../../shared/Entity";

export function createArrow(attacker, target) {
    return new Entity({
        id: crypto.randomUUID(),

        x: attacker.x,
        y: attacker.y,

        type: "projectile",

        sprite: {
            type: "arrow",
            anchor: { x: 0.5, y: 0.5 },
            size: { w: 8, h: 8 }
        },

        collider: {
            radius: 4
        },

        data: {
            rotation: null,

            ownerId: attacker.id,

            damage: attacker.data.damage,

            speed: 10 * attacker.data?.projectileSpeed,

            target,

            state: "flying"
        }
    });
}