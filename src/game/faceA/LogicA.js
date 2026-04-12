// flujo de juego y funciones auxiliares de FaceA
// Game flow and auxiliary functions of FaceA

import gameState from "../state/GameStateG";
import { emit } from "../../utils/events";

export function plusTime(worldPos) {
    if (!gameState.gameStart || gameState.currentFace !== "A") return;

    gameState.currentTime += 0.5;

    emit("timeGained", {
        value: 0.5,
        pos: worldPos
    });
}









    
