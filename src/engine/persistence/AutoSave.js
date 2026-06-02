import SaveManager from "./SaveManager";
import gameState from "../../game/state/GameStateG";
import fadeState from "../scenes/FadeState";


let autosaveInterval = null;


function startAutoSave() {

    if(autosaveInterval) return;

    autosaveInterval = setInterval(() => {

        if (gameState.gamePause || !gameState.gameStart) return;
        if (gameState.currentFace === "T") return;
        if (fadeState.active) return;

        SaveManager.saveGame();
    }, 10000);
}

function stopAutoSave() {

    clearInterval(autosaveInterval);

    autosaveInterval = null;
}

export default {
    startAutoSave,
    stopAutoSave
};