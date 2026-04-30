//functions for exp management

import gameState from "../state/GameStateG";


function plusExp(value) {
    if (!gameState.gameStart || gameState.currentFace !== "A") return;

    gameState.currentExp += value;
}

export {
    plusExp
}