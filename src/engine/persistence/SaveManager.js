import gameState from "../../game/state/GameStateG";
import gameStateA from "../../game/faceA/state/GameStateA";
import gameStateB from "../../game/faceB/state/GameStateB";
import worldState from "../../game/world/WorldState";
import backSceneState from "../scenes/BackSceneState";
import { upgradeState, upgradeLogicianState } from "../../game/progression/UpgradeState";
import fadeState from "../scenes/FadeState";
import { tutorial } from "../../game/tutorials/TutorialState";


const SAVE_KEY = "persistence_clicker-save";


function createSaveData() {
    return {
        version: 1,

        gameState,
        gameStateA,
        gameStateB,
        worldState,
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
    Object.assign(worldState, data.worldState);
    Object.assign(backSceneState, data.backSceneState);
    Object.assign(upgradeState, data.upgradeState);
    Object.assign(upgradeLogicianState, data.upgradeLogicianState);
    Object.assign(fadeState, data.fadeState);

    tutorial.completed = data.tutorial.completed;
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

export default {
    saveGame,
    loadGame,
    hasSave,
    deleteSave
};