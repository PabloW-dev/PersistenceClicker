//definition of archetypes (in systems because is an authomatism in some way)

import { createTheProtagonist } from "../entities/Archetypes";
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
            return Math.floor(10 * Math.pow(1.8, level - 1));
        },

        getCurrentResurrectionDuration: (lastResurrection) => {
            return Math.floor(10 * Math.pow(1.8, lastResurrection - 1));
        }
    }
];