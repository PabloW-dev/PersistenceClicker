// estado global para datos compartidos entre FaceA y FaceB
// global status for data shared between FaceA and FaceB

const gameState = {
    currentExp: 0,
    currentTime: 60.0,
    currentFace: "A",
    gameStart: true,
    activeProcesses: [],
    timeShakeTrigger: 0,
    selectedEntityId: null, //because I don't want a value since beggining, only for give values
    firstRun: true
};


export default gameState;