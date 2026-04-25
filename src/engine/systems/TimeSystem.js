// actualiza deltaTime, timers y offline time
import gameState from "../../game/state/GameStateG";


export default function timeSystem(deltaTime) {

    const finished = [];

    gameState.activeProcesses.forEach(process => {
        process.progress += deltaTime;

        if (process.progress >= process.duration) {
            process.onComplete?.();
            finished.push(process.id);
        }
    });

    gameState.activeProcesses = gameState.activeProcesses.filter(p => !finished.includes(p.id));
}