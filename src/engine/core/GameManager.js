// coordinación general del juego, gestión de flujo entre FaceA y FaceB
// general game coordination, flow management between FaceA and FaceB
import CanvasRenderer from "../renderer/CanvasRenderer.js";
import gameState from "../../game/state/GameStateG.js";
import interactionSystem from "../systems/InteractionSystem.js";
import worldState from "../../game/world/WorldState.js";
import Camera from "../camera/Camera.js";
import AssetsManager from "../../assets/AssetsManager.js";
import towerImg from "../../assets/sprites/Tower.png";

let renderer = null; //preparar la variable
let camera = null;

function init(canvas) { //esto resulta para que no inicie la función antes del renderizado del DOM, porque si no, no existe el canvas aún
    renderer = new CanvasRenderer(canvas);
    camera = new Camera();

    //load assets
    AssetsManager.loadImage("tower", towerImg);

    // conection for clicks
    renderer.onClick = (screenPos) => {
        const worldPos = camera.screenToWorld(screenPos);

        interactionSystem(worldPos);
    };
}

function loop(deltaTime) {
    if (!gameState.gameStart) return;

    //Face A time logic
    if (gameState.currentFace === "A" ) {
        gameState.currentTime = Math.max(0, gameState.currentTime - deltaTime);

        renderer.render(worldState, camera);
    }
}

export { init };
export default loop;