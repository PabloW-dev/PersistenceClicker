//for all systems of A:

import portalSystem, { portalLevelSystem } from "./PortalSystem";
import enemySystem from "./EnemySystem.js";
import spawnSystem from "./SpawnSystem.js";


const systems = [];

export function initSystems() {
    systems.push(portalSystem);
    systems.push(portalLevelSystem);
    systems.push(spawnSystem);
    systems.push(enemySystem);
}

export function runSystems(deltaTime, camera) {
    systems.forEach(system => system(deltaTime, camera));
}