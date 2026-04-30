// actualiza deltaTime, timers y offline time
import gameState from "../../game/state/GameStateG";


export default function timeSystem(deltaTime) {

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