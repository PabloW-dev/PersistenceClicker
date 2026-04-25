//definition of archetypes (in systems because is an authomatism in some way)

import { createTheProtagonist } from "../entities/Archetypes";


export const ARCHETYPES = [
    {
        id: "protagonist",
        name: "The Protagonist",
        summoningDuration: 10,
        spriteType: "protagonist",
        factory: createTheProtagonist,

        getLevelUpDuration: (level) => {
            return Math.floor(10 * Math.pow(1.8, level - 1));
        }
    }
];