//for tutorials of the game

import gameStateA from "../faceA/state/GameStateA";
import worldState from "../world/WorldState";

let timer = 0;
const HINT_DELAY = 5;

export function updateTutorialA(deltaTime) {
    if (gameStateA.hint.dismissed) return;

    timer += deltaTime;

    if (timer >= HINT_DELAY) {
        const tower = worldState.structures.find(s => s.type === "tower");

        if (!tower) return;

        gameStateA.hint.active = true;
        gameStateA.hint.x = tower.x;
        gameStateA.hint.y = tower.y;
    }
}