// detector de clicks
import worldState from "../../game/world/WorldState";
import { plusTime } from "../../game/faceA/LogicA.js";
import { plusExp } from "../../game/shared/Exp";

import { getEntityAtPosition } from "./ColliderSystem.js";

function interactionSystem(worldPos) {
    const entity = getEntityAtPosition(worldPos, worldState.structures);

    if(!entity) return;

    console.log("clicked entity:", entity.id);

    if(entity.type === "tower") {
        plusExp(0.1);
        plusTime(worldPos);
    }
}

export default interactionSystem;