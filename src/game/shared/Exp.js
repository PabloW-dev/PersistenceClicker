//functions for exp management

import gameState from "../state/GameStateG";


function plusExp(value) {
    if (!gameState.gameStart || gameState.currentFace !== "A") return;

    gameState.currentExp += value;
    gameState.statistics.totalExp += value;
    gameState.statistics.totalExpOfRun += value;
}

export {
    plusExp
}