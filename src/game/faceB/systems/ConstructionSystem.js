// for buildings and paths
import worldState from "../../world/WorldState";
import gameState from "../../state/GameStateG";
import gameStateB from "../state/GameStateB";
import { BUILDINGS } from "./BuildingsDefinition";


export function canShowButton(buildingId) {

    const building = BUILDINGS.find(b => b.id === buildingId);
    
    if(!building) return false;

    return building.canShowButton();
}

export function canBeBuild(buildingId) {

    const building = BUILDINGS.find(b => b.id === buildingId);
    
    if(!building) return false;

    return building.canBeBuild();
}

export function startBuildingMode(buildingId) {

    if (!canBeBuild(buildingId)) return false; //este check parece redundante en cuanto a gameplay pero nos libra de problemas de lógica interna

    const building = BUILDINGS.find(b => b.id === buildingId);

    

    if (!building) return false;

    //cancelar cualquier selección en el canvas que pudiese haber en el momento de darle al botón
    gameState.selectedEntityId = null;

    //activar BuildingMode
    gameStateB.buildMode.active = true;
    gameStateB.buildMode.buildingId = buildingId;

    return true;
}

export function cancelBuildMode() { //básicamente reinicio buildMode entero
    gameStateB.buildMode.active = false;

    gameStateB.buildMode.buildingId = null;

    gameStateB.buildMode.hoverTileX = null;
    gameStateB.buildMode.hoverTileY = null;

    gameStateB.buildMode.canPlace = false;
}

export function canPlaceBuilding(tileX, tileY) {

    const buildMode = gameStateB.buildMode;

    const definition = BUILDINGS.find(b => b.id === buildMode.buildingId); //porque se lo hemos pasado al hacer click en el botón ;)

    if(!definition) return false;

    const tile = worldState.tileMap?.getTile(
        tileX,
        tileY
    );

    if (!tile) return false;

    //crear un building previo para que se puedan leer los datos
    const previewBuilding = definition.create(
        0,
        0,
        tileX,
        tileY,
        definition,
    );

    //check del type del tile
    if(
        !previewBuilding.data.tileTypeForEmplacement.includes(
            tile.groundType
        )
    ) {
        return false;
    }

    //tile ocupado
    if (tile.structureId) {
        return false;
    }

    return true;
}

export function updateBuildMode(worldPos) {

    if(!gameStateB.buildMode.active) return;

    const cell = worldState.grid.worldToGrid(worldPos);

    gameStateB.buildMode.hoverTileX = cell.x;
    gameStateB.buildMode.hoverTileY = cell.y;

    gameStateB.buildMode.canPlace = canPlaceBuilding(cell.x, cell.y);
}

export function placeBuilding(tileX, tileY) {

    if(!canPlaceBuilding(tileX, tileY)) { //cancela si el tile no resulta válido
        cancelBuildMode();
        return false;
    }

    const definition = BUILDINGS.find(
        b => b.id === gameStateB.buildMode.buildingId
    );

    if (!definition) { //si no encuentra el build que le hemos pasado en el array de definicion
        cancelBuildMode();
        return false;
    }

    const worldPos = worldState.grid.gridToWorld({
        x: tileX,
        y: tileY
    });

    const building = definition.create(
        worldPos.x,
        worldPos.y,
        tileX,
        tileY,
        definition,
    );

    //EXP
    gameState.currentExp -= definition.getCost();

    building.data.state = "emplacement";

    worldState.structures.push(building);

    const tile = worldState.tileMap.getTile(
        tileX,
        tileY
    );

    tile.structureId = building.id;

    cancelBuildMode();

    return true;
}

export function buildingNeedsMaterials(structure) {
    return Object.values(structure.data.matsRequired)
        .some(amount => amount > 0);
}