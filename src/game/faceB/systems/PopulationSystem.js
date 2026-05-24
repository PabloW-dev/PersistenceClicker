//top of population
import worldState from "../../world/WorldState";
import { getMaxPopulation } from "../LogicB";

//TO DO: las casas suman máxmimo de villagers

export const POPULATION = {
    villagers: {
        maxPopulation: 200,
        getCurrentMax: () => {
            return getMaxPopulation(
                5,
                "villagerHouse"
            )
        },
        currentPopulation: 0,
        topPopulation: false
    },

    medusins: {
        maxPopulation: 800,
        currentMaxPopulation: 8,
        currentPopulation: 0,
        topPopulation: 0
    }
};

export function populationSystem() {
    //población inicial
    const villagers = worldState.entities.filter(e => e.type === "villager").length;

    //meter en currentPopulation la cantidad de villagers que hay
    POPULATION.villagers.currentPopulation = villagers;

    //marcar que se ha alcanzado el límite de población actual
    POPULATION.villagers.topPopulation =
    villagers >= POPULATION.villagers.getCurrentMax();
}