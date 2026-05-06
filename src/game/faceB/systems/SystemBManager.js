import decaySystem from "./Decaysystem.js";
import gameState from "../../state/GameStateG.js";

const systems = [];

export function initSystemsB() {
    systems.length = 0; 


    systems.push(decaySystem);
}

export function runSystemsB(deltaTime, camera) {
    if(gameState.currentFace !== "B") return;
    
    systems.forEach(system => system(deltaTime, camera));
}