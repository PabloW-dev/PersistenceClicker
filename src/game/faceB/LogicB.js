// flujo de juego y funciones auxiliares de FaceB
// Game flow and auxiliary functions of FaceB

import { createTree } from "./entities/Resources";
import { TreeStatesManager } from "./systems/MachineStatesB";
import { randomFrom } from "../../utils/math";

const species = ["Oak", "Pine", "Birch"];

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