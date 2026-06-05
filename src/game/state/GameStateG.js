// estado global para datos compartidos entre FaceA y FaceB
// global status for data shared between FaceA and FaceB

const gameState = {
    platform: "desktop",

    currentExp: 0,
    currentTime: 60.0,
    currentFace: "M",
    gameStart: false,
    activeProcesses: [],
    timeShakeTrigger: 0,
    timeShakeTriggerEXP: 0,
    selectedEntityId: null,
    firstRun: true,
    transitioning: false,
    gamePause: false,

    statistics: {
        totalExp: 0,
        totalExpOfRun: 0,
        totalTime: 0,
        timeOfRun: 0,
    }
};


export default gameState;