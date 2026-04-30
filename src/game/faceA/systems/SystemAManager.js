//for all systems of A:

import portalSystem, { portalLevelSystem } from "./PortalSystem";
import shadowSystem from "./ShadowSystem.js";
import spawnSystem from "./SpawnSystem.js";
import spawnAnimationSystem from "./SpawnAnimationSystem.js";
//import { updateTutorialA } from "../../tutorials/tutorials.js";
import combatSystem from "./CombatSystem.js";
import gameState from "../../state/GameStateG.js";

const systems = [];

export function initSystems() {
    systems.length = 0; 

    if(gameState.currentFace !== "A") return;

    systems.push(portalSystem);
    systems.push(portalLevelSystem);
    systems.push(spawnSystem);
    systems.push(shadowSystem);
    systems.push(spawnAnimationSystem);
    //systems.push(updateTutorialA);
    systems.push(combatSystem);
}

export function runSystems(deltaTime, camera) {
    systems.forEach(system => system(deltaTime, camera));
}