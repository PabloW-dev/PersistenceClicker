// actualiza deltaTime, timers y offline time
import { startTransition } from "react";
import gameState from "../../game/state/GameStateG";
import { changeToB } from "../scenes/SceneManager";


export default function timeSystem(deltaTime) {
    if(gameState.currentFace === "A") {
        gameState.statistics.timeOfRun += deltaTime;
        if(!gameState.transitioning && gameState.currentTime <= 0) {
            gameState.transitioning = true;
            startTransition(() => changeToB());
        }
    } else if(gameState.currentFace === "B") {
        gameState.statistics.timeOfRun = 0;
    }

    if(gameState.gameStart) {
        gameState.statistics.totalTime += deltaTime;
    }

    gameState.activeProcesses.forEach(process => {
        if (process.state !== "active") {
            return;
        }

        process.progress += deltaTime;

        if (process.progress >= process.duration) {
            
            process.state = "completed";
            process.onComplete?.();
        }
    });

    //clean
    gameState.activeProcesses = gameState.activeProcesses.filter(
        p => p.state === "active"
    );
}