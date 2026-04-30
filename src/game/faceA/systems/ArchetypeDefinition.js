//definition of archetypes (in systems because is an authomatism in some way)

import { createTheProtagonist, createTheLogician } from "../entities/Archetypes";
import { createEchoProtagonist } from "../entities/Enemies";


export const ARCHETYPES = [
    {
        id: "protagonist",
        name: "The Protagonist",
        summoningDuration: 10,
        spriteType: "protagonist",
        factory: createTheProtagonist,

        echoFactory: (x, y) =>
            createEchoProtagonist(x, y, "echoProtagonist"),


        getLevelUpDuration: (level) => {
            return Math.floor(10 * Math.pow(1.6, level - 1));
        },

        getCurrentResurrectionDuration: (lastResurrection) => {
            return Math.floor(10 * Math.pow(1.6, lastResurrection - 1));
        }
    },

    {
        id: "logician",
        name: "The Logician",
        summoningDuration: 30,
        spriteType: "logician",
        factory: createTheLogician,

        echoFactory: null, //TO DO

        getLevelUpDuration: (level) => {
            return Math.floor(30 * Math.pow(1.6, level - 1));
        },

        getCurrentResurrectionDuration: (lastResurrection) => {
            return Math.floor(30 * Math.pow(1.6, lastResurrection - 1));
        }
    }
];