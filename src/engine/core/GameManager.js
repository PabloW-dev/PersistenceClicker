// coordinación general del juego, gestión de flujo entre FaceA y FaceB
// general game coordination, flow management between FaceA and FaceB
import CanvasRenderer from "../renderer/CanvasRenderer.js";
import interactionSystem from "../systems/InteractionSystem.js";
import gameState from "../../game/state/GameStateG.js";
import worldState from "../../game/world/WorldState.js";
import Camera from "../camera/Camera.js";
import AssetsManager from "../../assets/AssetsManager.js";
import assetManifest from "../../assets/AssetsManifest.js";
import { initSystems, runSystems } from "../../game/faceA/systems/SystemAManager.js";


let renderer = null;
let camera = null;

function init(canvas) {
    renderer = new CanvasRenderer(canvas);
    camera = new Camera();

    AssetsManager.loadAll(assetManifest);

    initSystems();

    renderer.onClick = (screenPos) => {
        const worldPos = camera.screenToWorld(screenPos);
        interactionSystem(worldPos);
    };
}

function loop(deltaTime) {
    if (!gameState.gameStart) return;

    if (gameState.currentFace === "A") {
        gameState.currentTime = Math.max(0, gameState.currentTime - deltaTime);

        const clampedDelta = Math.min(deltaTime, 0.033); // máximo ~30 FPS

        runSystems(clampedDelta, camera);

        renderer.render(worldState, camera);
    }
}

export { init };
export default loop;