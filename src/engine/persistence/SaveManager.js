import gameState from "../../game/state/GameStateG";
import gameStateA from "../../game/faceA/state/GameStateA";
import gameStateB from "../../game/faceB/state/GameStateB";
import worldState from "../../game/world/WorldState";
import backSceneState from "../scenes/BackSceneState";
import { upgradeState, upgradeLogicianState } from "../../game/progression/UpgradeState";
import fadeState from "../scenes/FadeState";
import { tutorial } from "../../game/tutorials/TutorialState";
import { metaResources } from "../../game/shared/MetaResources";
import TileMap from "../../game/world/TileMap";
import { restoreProcessCallbacks } from "./helpersOfSaving";


const SAVE_KEY = "persistence_clicker-save";
const META_KEY = "persistence_clicker-meta";


function createSaveData() {
    return {
        version: 1,

        gameState,
        gameStateA,
        gameStateB,

        worldState: {
            seed: worldState.seed,
            structures: worldState.structures,
            entities: worldState.entities,
            scenographics: worldState.scenographics
        },

        backSceneState,
        upgradeState,
        upgradeLogicianState,
        fadeState,

        tutorial: {
            completedA: tutorial.AtutorialComplete,
            completedB: tutorial.BtutorialComplete
        }
    };
}

function applySaveData(data) {
    Object.assign(gameState, data.gameState);
    Object.assign(gameStateA, data.gameStateA);
    Object.assign(gameStateB, data.gameStateB);


    worldState.seed = data.worldState.seed;

    worldState.entities = data.worldState.entities;
    worldState.structures = data.worldState.structures;
    worldState.scenographics = data.worldState.scenographics;


    Object.assign(backSceneState, data.backSceneState);
    Object.assign(upgradeState, data.upgradeState);
    Object.assign(upgradeLogicianState, data.upgradeLogicianState);
    Object.assign(fadeState, data.fadeState);

    tutorial.completedA = data.tutorial.completedA;
    tutorial.completedB = data.tutorial.completedB;
}

function saveGame() {
    if (gameState.currentFace === "T") return;
    
    const data = createSaveData();

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);

    if(!raw) return false;

    try {
        const data = JSON.parse(raw);

        applySaveData(data);

        restoreProcessCallbacks();

        if (worldState.seed) {
            worldState.tileMap = new TileMap(
                worldState.grid.width,
                worldState.grid.height,
                worldState.seed,
                worldState.grid.cellSize
            );
        }

        return true;

    } catch(err) {
        console.error("Error loading save", err);
        return false;
    }
}

function hasSave() {
    return !!localStorage.getItem(SAVE_KEY);
}

function deleteSave() {
    localStorage.removeItem(SAVE_KEY);
}

function saveMeta() {
    localStorage.setItem(
        META_KEY,
        JSON.stringify(metaResources)
    );
}

function loadMeta() {
    const raw = localStorage.getItem(META_KEY);

    if(!raw) return;

    try {
        const data = JSON.parse(raw);

        Object.assign(metaResources, data);

    } catch(err) {
        console.error("Error loading meta", err);
    }
}

export default {
    saveGame,
    loadGame,
    hasSave,
    deleteSave,
    saveMeta,
    loadMeta
};