//population of B:
import { randomRate, randomInt } from "../../../utils/math";
import Entity from "../../shared/Entity";

export function createVillager(x, y, spriteType) {
    const baseCarryCapacity = randomInt(8, 16); 
    const baseActionCooldown = randomInt(4, 6);
    const baseSpeed = randomInt(4, 8);
    const baseFoodDecay = randomRate(0.8, 1.2);
    const baseEnergyDecay = randomRate(0.8, 1.2);
    const baseWaterDecay = randomRate(0.8, 1.2);
    const baseLearningRate = randomRate(0.8, 1.2);
    const baseMaxHp = 50;
    const baseAgeMax = 300;

    return new Entity({
        id: crypto.randomUUID(),
        x,
        y,
        type: "villager",

        sprite: {
            type: spriteType,
            anchor: { x: 0.5, y: 0.5 },
            size: { w: 24, h: 30 }
        },

        collider: {
            radius: 24
        },

        data: {
            hp: 50,
            hpMax: baseMaxHp,
            baseMaxHp: baseMaxHp,

            name: null,
            title: null,

            food: 100,
            foodMax: 100,
            foodDecay: baseFoodDecay,
            baseFoodDecay: baseFoodDecay,

            energy: 100,
            energyMax: 100,
            energyDecay: baseEnergyDecay,
            baseEnergyDecay: baseEnergyDecay,
            movementFatigue: 0,

            water: 100,
            waterMax: 100,
            waterDecay: baseWaterDecay,
            baseWaterDecay: baseWaterDecay,

            age: 0,
            ageMax: baseAgeMax,
            baseAgeMax: baseAgeMax,

            inventory: {
                carryCapacity: baseCarryCapacity,
                baseCarryCapacity: baseCarryCapacity,
                freeSpace: 999,

                items: {

                }
            },         
            
            actionCooldown: baseActionCooldown,
            baseActionCooldown: baseActionCooldown,
            actionTimer: 0,
            actionTarget: null,
            actionType: null,

            professionEXP: {},
            profession: null,
            professionData: {
                level: 0,
                range: null
            },
            learningRate: baseLearningRate,
            baseLearningRate: baseLearningRate,

            state: "idle",

            speed: baseSpeed,
            baseSpeed: baseSpeed,
            target: null,
            path: [],
            pathIndex: 0,
            movementType: "ground",
            steps: 0,
            lastStepCell: null,

            hitFlash: 0,
            actionFlash: 0,

            warningFlash: 0,
            warningType: null,

            spawning: true,
            spawnProgress: 0,

            hiddenTimer: 0,
            hiddenInStructure: false
        }
    });
}