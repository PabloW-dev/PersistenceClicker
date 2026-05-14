import { createVillagerHouse } from "../entities/Buildings";
import { POPULATION } from "./PopulationSystem";
import gameState from "../../state/GameStateG";
import { getScaledValue } from "../LogicB";

export const BUILDINGS = [
    {
        id: "villagerHouse",
        name: "Rest Place",
        
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
            return POPULATION.villagers.currentPopulation > 0;
        },

        canBeBuild: () => {
            return gameState.currentExp >= getScaledValue(
                15,
                "villagerHouse"
            );
        }
    }
];