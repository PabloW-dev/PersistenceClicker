//functions of general logic
import gameState from "./state/GameStateG";


export function restTime(process) {
    
    if(!process || gameState.currentTime <= 0) return;

    process.progress += 1;

    gameState.currentTime -= 1;
    gameState.timeShakeTrigger = Date.now();
}

export function shouldShowArchetype(a, state) {
    return true;
}