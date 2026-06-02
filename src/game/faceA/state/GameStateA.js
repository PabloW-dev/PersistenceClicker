// Estado de la partida en FaceA en memoria (tiempo, score, enemigos...)
// Game status in FaceA in memory (time, score, enemies...)

const gameStateA = {
    portalLevel: 1,
    portalLevelTimer: 0,

    //MOVE TO TUTORIAL ENTORNE
    hint: 
    {
        active: false,
        
        type: null,

        targetId: null,
        
        x: 0,
        y: 0,
        
        startTime: 0,
    },
    
    hasSummonedArchetypes: 
    {

    }
}

export default gameStateA;