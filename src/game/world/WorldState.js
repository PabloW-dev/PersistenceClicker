// estado del mapa en la partida y datos del mapa

//pendiente de ARREGLAR MUCHO MUCHO para el cambio de A a B

import Grid from "./Grid.js";
import createTower from "../faceA/entities/Tower.js";
import createCenterTown from "../faceB/entities/CenterTown.js";
import gameState from "../state/GameStateG.js";

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 1600;



const worldState = {
    grid: new Grid(WORLD_WIDTH, WORLD_HEIGHT),

    structures: gameState.currentFace === "A"
        ? [createTower()]
        : [createCenterTown()],

    entities: []
};

export default worldState;