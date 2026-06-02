// actualiza deltaTime, timers y offline time
import gameState from "../../game/state/GameStateG";
import { changeToB } from "../scenes/SceneManager";
import { startSceneTransition } from "../scenes/TransitionManager";


export default function timeSystem(deltaTime, camera) {
    if(gameState.currentFace === "A" || gameState.currentFace === "T") {
        gameState.statistics.timeOfRun += deltaTime;

        if(!gameState.transitioning && gameState.currentTime <= 0 && gameState.currentFace === "A") {
            gameState.gamePause = true;

            gameState.transitioning = true;
            startSceneTransition(() => changeToB(), camera);
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