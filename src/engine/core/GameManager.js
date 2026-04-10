// coordinación general del juego, gestión de flujo entre FaceA y FaceB
// general game coordination, flow management between FaceA and FaceB

import gameState from "../../game/state/GameStateG.js";

function loop(deltaTime) {
    if (!gameState.gameStart) return;

    //Face A time logic
    if (gameState.currentFace === "A" ) {
        gameState.currentTime = Math.max(0, gameState.currentTime - deltaTime);

        console.log(gameState.currentTime);
    }
}

export default loop;