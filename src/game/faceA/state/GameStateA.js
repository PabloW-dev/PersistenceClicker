// Estado de la partida en FaceA en memoria (tiempo, score, enemigos...)
// Game status in FaceA in memory (time, score, enemies...)

const gameStateA = {
    portalLevel: 1,
    portalLevelTimer: 0,
    hint: {
        active: false,
        x: 0,
        y: 0,
        timer: 0,
        dismissed: false
    }
}

export default gameStateA;