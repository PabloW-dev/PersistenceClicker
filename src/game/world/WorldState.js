// estado del mapa en la partida y datos del mapa

import Grid from "./Grid.js";
import createTower from "../faceA/entities/Tower.js";

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 1600;

const worldState = {
    grid: new Grid(WORLD_WIDTH, WORLD_HEIGHT),

    structures: [
        createTower()
    ],

    entities: []
};

export default worldState;