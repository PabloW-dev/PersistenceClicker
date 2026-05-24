import worldState from "../world/WorldState";
import { randomFrom } from "../../utils/math";
import { createRuin } from "../faceB/entities/Resources";

export const buildingsToGoRuin = [];

const ruins = ["RuinOne", "RuinTwo", "RuinThree"];

export function BuildingToRuin() {
    if (buildingsToGoRuin.length > 0) {
        for (const structure of buildingsToGoRuin) {

            const buildX = structure.x;
            const buildY = structure.y;

            const tileX = structure.tileX;
            const tileY = structure.tileY;

            const tile = worldState.tileMap.getTile(tileX, tileY);

            // borrar building
            worldState.structures =
                worldState.structures.filter(
                    s => s.id !== structure.id
                );

            // crear ruin
            const ruin = createRuin(
                buildX,
                buildY,
                tileX,
                tileY,
                randomFrom(ruins)
            );

            worldState.scenographics.push(ruin);

            if (tile) {
                tile.structureId = ruin.id;
            }
        }
    }

    buildingsToGoRuin.length = 0;
}