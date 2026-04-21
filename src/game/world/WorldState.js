// estado del mapa en la partida y datos del mapa

import createTower from "../faceA/entities/Tower.js";

const worldState = {
    grid: {
        WORLD_WIDTH: 2000,
        WORLD_HEIGHT: 1600
    },

    structures: [
        createTower()
    ],

    entities: []
};

export default worldState;