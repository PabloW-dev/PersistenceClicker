// Estado de la partida en FaceB en memoria (tiempo, score, aldeanos...)
// Game status in FaceB in memory (time, score, villagers...)


const gameStateB = {
    EXPinCenterTown: 0,
    EXPtoNextVillager: 0,

    buildMode: {
        active: false,
        buildingId: null,

        hoverTileX: null,
        hoverTileY: null,

        canPlace: false
    }
}

export default gameStateB;