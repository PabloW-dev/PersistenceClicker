// estado del mapa en la partida y datos del mapa

import createTower from "../faceA/entities/Tower.js";

const worldState = {
    grid: {},

    structures: [
        createTower()
    ],

    entities: []
};

export default worldState;