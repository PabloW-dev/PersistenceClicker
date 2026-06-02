import { createVillagerHouse, createSilo } from "../entities/Buildings";
import { createSundial } from "../entities/SpecialBuildings";
import { POPULATION } from "./PopulationSystem";
import gameState from "../../state/GameStateG";
import worldState from "../../world/WorldState";
import { getScaledValue } from "../LogicB";

export const BUILDINGS = [
    {
        id: "villagerHouse",
        name: "House",
        
        getCost: () => {
            return getScaledValue(
                15,
                "villagerHouse"
            );
        },

        spriteType: "villagerHouse",

        spriteInConstruction: "villagerHouseInConstruction",

        create: (x, y, tileX, tileY, definition) =>
            createVillagerHouse(
                x,
                y,
                tileX,
                tileY,
                definition.spriteType,

                {
                    wood: getScaledValue(
                        10,
                        "villagerHouse",
                    )
                }
            ),

        maxInWorld: Infinity,

        canShowButton: () => {
            return worldState.structures.filter(
                s => s.data.referenceId === "sundial" &&
                s.data.state === "build"
            ).length > 0;
        },

        canBeBuild: () => {
            return gameState.currentExp >= getScaledValue(
                15,
                "villagerHouse"
            );
        }
    },

    {
        id: "silo",
        name: "Silo",
        
        getCost: () => {
            return getScaledValue(
                25,
                "silo"
            );
        },

        spriteType: "silo",

        spriteInConstruction: "siloInConstruction",

        create: (x, y, tileX, tileY, definition) =>
            createSilo(
                x,
                y,
                tileX,
                tileY,
                definition.spriteType,

                {
                    wood: getScaledValue(
                        10,
                        "silo",
                    ),
                    stone: getScaledValue(
                        5,
                        "silo"
                    )
                }
            ),

        maxInWorld: Infinity,

        canShowButton: () => {
            return worldState.structures.filter(
                s => s.data.referenceId === "villagerHouse" &&
                s.data.state === "build"
            ).length > 0;
        },

        canBeBuild: () => {
            return gameState.currentExp >= getScaledValue(
                25,
                "silo"
            );
        }
    }
];

export const SPECIAL_BUILDINGS = [
    {
        id: "sundial",
        name: "Sundial",
        
        getCost: () => {
            return getScaledValue(
                45,
                "sundial"
            );
        },

        spriteType: "sundial",

        spriteInConstruction: "sundialInConstruction",

        create: (x, y, tileX, tileY, definition) =>
            createSundial(
                x,
                y,
                tileX,
                tileY,
                definition.spriteType,

                {
                    wood: getScaledValue(
                        15,
                        "sundial",
                    )
                }
            ),

        maxInWorld: 1,

        canShowButton: () => {
            return POPULATION.villagers.currentPopulation > 0;
        },

        canBeBuild: () => {
            return gameState.currentExp >= getScaledValue(
                45,
                "sundial"
            );
        }
    }
];

export const BUILDABLES = [
    ...BUILDINGS,
    ...SPECIAL_BUILDINGS
];