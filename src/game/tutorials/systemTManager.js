import gameState from "../state/GameStateG";
import { updateTutorialB } from "./tutorialForB";
import { updateTutorialA } from "./tutorials";

const systems = [];

export function initSystemsT() {
    systems.length = 0;

    systems.push(updateTutorialA);
    systems.push(updateTutorialB);
}

export function runSystemsT(deltaTime, camera) {
    if(gameState.currentFace !== "T" && gameState.currentFace !== "B") return;

    systems.forEach(system => system(deltaTime, camera));
}