import decaySystem from "./Decaysystem.js";
import { productionSystem } from "./ProductionSystem.js";
import { populationSystem } from "./PopulationSystem.js";
import gameState from "../../state/GameStateG.js";

const systems = [];

export function initSystemsB() {
    systems.length = 0; 


    systems.push(decaySystem);
    systems.push(productionSystem);
    systems.push(populationSystem);
}

export function runSystemsB(deltaTime, camera) {
    if(gameState.currentFace !== "B") return;
    
    systems.forEach(system => system(deltaTime, camera));
}