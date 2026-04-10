// gestión de eventos del juego (EvenEmitter o custom events)
// game event management (EvenEmitter or custom events)
import gameState from "../game/state/GameStateG.js";

function plusTime() {
    if (!gameState.gameStart || gameState.currentFace !== "A") return;

    gameState.currentTime += 0.5;
}



export {
    plusTime
}