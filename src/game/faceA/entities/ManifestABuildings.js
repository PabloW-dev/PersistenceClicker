import Entity from "../../shared/Entity";
import { createSpecialOccupiedTiles } from "../../faceB/entities/SpecialBuildings";

export function createDefenseTower(x, y, sourceId) {
    return new Entity({
        id: crypto.randomUUID(),

        x,
        y,

        type: "structure",

        sprite: {
            type: "siloTower",
            anchor: { x: 0.5, y: 0.75 },
            size: { w: 32, h: 48 }
        },

        collider: {
            radius: 30
        },

        data: {
            referenceId: "defenseTower",
            combatId: "Atower",

            sourceId,

            scale: 1,

            hp: 25,
            hpMax:25,

            actionDescription: "Attacks enemies automatically, including flying ones",

            canFight: true,
            damage: 20,
            defense: 1,
            attackRange: 250,
            visionRange: 250,
            attackCooldown: 3,
            attackTimer: 0,
            attackType: "projectile",
            projectileSpeed: 20,

            combatTarget: null,
            combatOrigin: null,
            activeSkill: null,
            state: "idle",

            hitFlash: 0,
            attackFlash: 0,


            occupiedTiles: createSpecialOccupiedTiles(1)
        }
    });
}