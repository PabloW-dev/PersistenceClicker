//here there are the pasive influencies of structures and entities each others

import { getStructureInRadius } from "../../game/LogicG";
import worldState from "../../game/world/WorldState";

let timer = 0;

export function influenceSystem(deltaTime) {
    timer += deltaTime;

    if (timer < 1) return; //cada segundo está bien, no hace falta más porque ningún tile cambia el estado tan rápido

    timer = 0;

    for (const structure of worldState.structures) {
        if (structure.data.referenceId !== "silo") continue;

        const nearlyHouses = getStructureInRadius(
            structure.tileX,
            structure.tileY,
            3,
            s => s.data.referenceId === "villagerHouse"
        );

        const penalty = nearlyHouses.length * 10;

        structure.data.storage.capacity = Math.max(
            5,
            structure.data.storage.baseCapacity - penalty
        );
    }   
}