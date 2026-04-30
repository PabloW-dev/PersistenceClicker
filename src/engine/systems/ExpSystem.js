import gameState from "../../game/state/GameStateG";
import { upgradeLogicianState } from "../../game/progression/UpgradeState";


export default function ExpSystem(deltaTime) {

    if(!gameState.gameStart || gameState.currentFace !== "A") return;
    
    if(upgradeLogicianState.passiveExp) {
        gameState.currentExp += upgradeLogicianState.passiveExp * deltaTime;
    };
}
