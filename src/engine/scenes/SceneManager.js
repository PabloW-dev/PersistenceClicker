// transiciones:
import worldState from "../../game/world/WorldState";
import TileMap from "../../game/world/TileMap";
import generateSeed from "../../game/world/Seed";
import gameState from "../../game/state/GameStateG";
import { generateTrees, generateRocks, generateRuins, generateStatues } from "../../game/faceB/LogicB";

export default function changeFace() {
    if (gameState.currentFace === "B" && !worldState.seed) {
        worldState.seed = generateSeed();
        worldState.tileMap = new TileMap(
            worldState.grid.width,
            worldState.grid.height,
            worldState.seed,
            worldState.grid.cellSize
        );

        generateTrees(worldState.tileMap, worldState);
        generateRocks(worldState.tileMap, worldState);
        generateRuins(worldState.tileMap, worldState);
        generateStatues(worldState.tileMap, worldState);
    }
}