// detector de clicks
import worldState from "../../game/world/WorldState";
import { plusTime } from "../../game/faceA/LogicA.js";
import { plusExp } from "../../game/shared/Exp";

import { getEntityAtPosition } from "./ColliderSystem.js";

function interactionSystem(worldPos) {
    //STRUCTURES
    const structure = getEntityAtPosition(worldPos, worldState.structures);

    if(structure) {
        if(structure.type === "tower") {
            plusExp(0.1);
            plusTime(worldPos);
        }

        return;
    }

    //ENTITIES
    const entity = getEntityAtPosition(worldPos, worldState.entities);

    if(!entity) return;

    if(entity.type === "enemy") {
        entity.data.clicks -= 1;

        entity.data.hitFlash = Math.max(entity.data.hitFlash, 0.15);

        if(entity.data.clicks <= 0) {
            worldState.entities = worldState.entities.filter(e => e.id !== entity.id);
        }
    }
    
}

export default interactionSystem;