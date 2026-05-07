// flujo de juego y funciones auxiliares de FaceB
// Game flow and auxiliary functions of FaceB

import gameState from "../state/GameStateG";
import gameStateB from "./state/GameStateB";
import { emit } from "../../utils/events";
import { getRandomSpawnPosition, isSpawnValid } from "../../utils/math";
import { createTree, createRock, createRuin } from "./entities/Resources";
import { TreeStatesManager } from "./systems/MachineStatesB";
import { randomFrom } from "../../utils/math";
import { createLogicianStatue, createProtagonistStatue, createLogisticianStatue } from "./entities/SpecialBuildings";
import { createVillager } from "./entities/Population";

const species = ["Oak", "Pine", "Birch"];

const ruins = ["RuinOne", "RuinTwo", "RuinThree"];

const BASE_COST = 10;
const MULTIPLIER = 1.8;

export function restEXPCanvas(worldPos, camera) {
    if (!gameState.gameStart || gameState.currentFace !== "B") return;

    gameState.currentExp -= 1;
    gameState.timeShakeTriggerEXP = Date.now();

    emit("EXPlosted", {
        value: 1,
        pos: camera.worldToScreen(worldPos)
    });
}

export function addEXPToCenterTown(worldState) {
    if (!gameState.gameStart || gameState.currentFace !== "B") return;

    gameStateB.EXPinCenterTown += 1;

    const currentCost = getVillagerCost(worldState);

    if(gameStateB.EXPinCenterTown >= currentCost) {

        gameStateB.EXPinCenterTown = 0;

        spawnVillager(worldState);
    }
}


function randomRockType(tileMap, x, y) {
    const r = tileMap.random(x, y, 500);

    if (r < 0.55) return "Stone";
    if (r < 0.8) return "Copper";
    if (r < 0.93) return "Tin";

    return "Iron";
}

export function generateTrees(tileMap, worldState) {
    const maxTrees = Math.min(150, Math.floor(tileMap.width * tileMap.height * 0.1));
    let count = 0;

    for (let x = 0; x < tileMap.width; x++) {
        for (let y = 0; y < tileMap.height; y++) {

            if (count >= maxTrees) return;

            const tile = tileMap.getTile(x, y);
            if(!tile || tile.groundType !== "fertile") continue;

            const occupied = worldState.scenographics.some(e => e.tileX === x && e.tileY === y);

            if (occupied) continue;

            const density = tileMap.smoothNoise(x, y, 8, 200);

            const spawnChance =
                density > 0.6 ? 0.6 :
                density > 0.5 ? 0.3 : 
                0.05;

            const roll = tileMap.random(x, y, 999);

            if (roll < spawnChance) {
                const worldX = x * tileMap.cellSize + tileMap.cellSize / 2;
                const worldY = y * tileMap.cellSize + tileMap.cellSize / 2;

                const tree = createTree(worldX, worldY, x, y, randomFrom(species));

                tree.data.age = Math.random() * tree.data.maxYears;

                const state = 
                    tree.data.age < 20 ? "young" :
                    tree.data.age < 70 ? "mature" :
                    tree.data.age < 85 ? "old" :
                    "dead";

                TreeStatesManager(tree, state);

                tree.data.scale = tree.data.targetScale;

                worldState.scenographics.push(tree);

                count++;
            }
        }
    }
}

export function generateRocks(tileMap, worldState) {
    const maxRocks = Math.min(40, Math.floor(tileMap.width * tileMap.height * 0.1));
    let count = 0;

    for (let x = 0; x < tileMap.width; x++) {
        for (let y = 0; y < tileMap.height; y++) {

            if (count >= maxRocks) return;

            const tile = tileMap.getTile(x, y);
            if(!tile || tile.groundType !== "rocks") continue;

            const occupied = worldState.scenographics.some(e => e.tileX === x && e.tileY === y);

            if (occupied) continue;

            const density = tileMap.smoothNoise(x, y, 8, 200);

            const spawnChance =
                density > 0.6 ? 0.6 :
                density > 0.5 ? 0.3 : 
                0.05;

            const roll = tileMap.random(x, y, 999);

            if (roll < spawnChance) {
                const worldX = x * tileMap.cellSize + tileMap.cellSize / 2;
                const worldY = y * tileMap.cellSize + tileMap.cellSize / 2;

                const rock = createRock(worldX, worldY, x, y, randomRockType(tileMap, x, y));

                worldState.scenographics.push(rock);

                tile.structureId = rock.id;

                count++;
            }
        }
    }
}

export function generateRuins(tileMap, worldState) {
    const maxRuins = Math.min(10, Math.floor(tileMap.width * tileMap.height * 0.1));
    let count = 0;

    for (let x = 0; x < tileMap.width; x++) {
        for (let y = 0; y < tileMap.height; y++) {

            if (count >= maxRuins) return;

            const tile = tileMap.getTile(x, y);
            if(!tile || tile.groundType !== "plain") continue;

            const occupied = worldState.scenographics.some(e => e.tileX === x && e.tileY === y);

            if (occupied) continue;

            const roll = tileMap.random(x, y, 999);

            if (roll < 0.009) {
                const worldX = x * tileMap.cellSize + tileMap.cellSize / 2;
                const worldY = y * tileMap.cellSize + tileMap.cellSize / 2;

                const ruin = createRuin(worldX, worldY, x, y, randomFrom(ruins));

                ruin.data.years = Math.floor(Math.random() * (ruin.data.yearsToErase - 400));

                worldState.scenographics.push(ruin);

                tile.structureId = ruin.id;

                count++;
            }
        }
    }
}

export function generateStatues(tileMap, worldState) {

    const centerTown = worldState.structures.find(
        st => st.id === "centerTown"
    );

    if(!centerTown) return;

    const centerTileX = Math.floor(centerTown.x / tileMap.cellSize);
    const centerTileY = Math.floor(centerTown.y / tileMap.cellSize);

    const reservedTiles = [
        {
            offsetX: -4,
            offsetY: -6,
            sprite: "protagonistStatue",
            creator: createProtagonistStatue
        },
        {
            offsetX: -6,
            offsetY: -4,
            sprite: "logicianStatue",
            creator: createLogicianStatue
        },
        {
            offsetX: -7,
            offsetY: -2,
            sprite: "logisticianStatue",
            creator: createLogisticianStatue
        }
    ];

    for (const reserved of reservedTiles) {

        const tileX = centerTileX + reserved.offsetX;
        const tileY = centerTileY + reserved.offsetY;

        const tile = tileMap.getTile(tileX, tileY);

        if (!tile) continue;

        if (tile.groundType !== "centerRing") continue;

        const worldX =
            tileX * tileMap.cellSize +
            tileMap.cellSize;

        const worldY =
            tileY * tileMap.cellSize +
            tileMap.cellSize;

        const statue = reserved.creator(
            worldX,
            worldY,
            tileX,
            tileY,
            reserved.sprite
        );

        worldState.structures.push(statue);

        for (const offset of statue.data.occupiedTiles) {

            const occupiedTile = tileMap.getTile(
                tileX + offset.x,
                tileY + offset.y
            );

            if (occupiedTile) {
                occupiedTile.structureId = statue.id;
            }
        }
    }
}

function spawnVillager(worldState) {
    const center = worldState.structures.find(s => s.type === "centerTown");
    const grid = worldState.grid;

    if (!center) return;

    let pos;
    let attempts = 0;

    do {
        pos = getRandomSpawnPosition(center, 256, 288);
        attempts++;
    } while (
        !isSpawnValid(pos.x, pos.y, center, 256, grid) &&
        attempts < 50
    );

    const entity = createVillager(
        pos.x,
        pos.y,
        "villager"
    );

    worldState.entities.push(entity);

    console.log(worldState.entities);
}

function getVillagerCost(worldState) {

    const villagers = worldState.entities.filter(
        e => e.type === "villager"
    ).length;

    return Math.floor(
        BASE_COST * Math.pow(MULTIPLIER, villagers)
    );
}