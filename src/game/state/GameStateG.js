// estado global para datos compartidos entre FaceA y FaceB
// global status for data shared between FaceA and FaceB

const gameState = {
    currentExp: 10,
    currentTime: 0.0,
    currentFace: "B",
    gameStart: true,
    activeProcesses: [],
    timeShakeTrigger: 0,
    selectedEntityId: null, //because I don't want a value since beggining, only for give values
    firstRun: true
};


export default gameState;