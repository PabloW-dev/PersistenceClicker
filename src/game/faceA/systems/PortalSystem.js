// contador global, añade tiempo, restar tiempo

import worldState from "../../world/WorldState";
import createPortal from "../entities/Portal.js";
import gameStateA from "../state/GameStateA.js";

let spawnTimer = 0;
let spawnInterval = 30;
let timer = 0;
const interval = 300; //every 5 min the portals have a level up

export default function portalSystem(deltaTime) {
    spawnTimer += deltaTime;

    if (spawnTimer >= spawnInterval) {
        spawnPortal();
        spawnTimer = 0;

        // reduces the interval 1 each time
        spawnInterval = Math.max(3, spawnInterval * 0.99); //never less than 3 seconds
    }
}

function spawnPortal() {
    let x, y, dist;
    let valid = false;
    let attempts = 0;
    const maxAttemps = 100;

    const tower = worldState.structures.find(s => s.type === "tower");

    while (!valid && attempts < maxAttemps) {
        x = Math.random() * worldState.grid.WORLD_WIDTH;
        y = Math.random() * worldState.grid.WORLD_HEIGHT;

        const dx = x - tower.x;
        const dy = y - tower.y;
        dist = Math.sqrt(dx * dx + dy * dy);

        const farFromTower = dist > 150;
        const farFromPortals = isFarFromOtherPortals(x, y);

        valid = farFromTower && farFromPortals;

        attempts++;
    }

    if (valid) {
        worldState.entities.push(createPortal(x, y));
    }
}

function isFarFromOtherPortals(x, y, minDistance = 100) {
    return !worldState.entities.some(e => {
        if (e.type !== "portal") return false;

        const dx = x - e.x;
        const dy = y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        return dist < minDistance;
    });
}

export function portalLevelSystem(deltaTime) {
    timer += deltaTime;

    if (timer >= interval) {
        timer = 0;

        gameStateA.portalLevel += 1;
    }
}