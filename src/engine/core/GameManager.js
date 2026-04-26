// coordinación general del juego, gestión de flujo entre FaceA y FaceB
// general game coordination, flow management between FaceA and FaceB
import CanvasRenderer from "../renderer/CanvasRenderer.js";
import interactionSystem from "../systems/InteractionSystem.js";
import gameState from "../../game/state/GameStateG.js";
import worldState from "../../game/world/WorldState.js";
import { updateGrid } from "../../game/world/Map.js";
import Camera from "../camera/Camera.js";
import AssetsManager from "../../assets/AssetsManager.js";
import assetManifest from "../../assets/AssetsManifest.js";
import timeSystem from "../systems/TimeSystem.js";
import movementSystem from "../systems/MovementSystem.js";
import { initSystems, runSystems } from "../../game/faceA/systems/SystemAManager.js";
import combatSystem from "../../game/faceA/systems/CombatSystem.js";


let renderer = null;
let camera = null;

function init(canvas) {
    renderer = new CanvasRenderer(canvas);
    camera = new Camera(renderer.canvas);

    AssetsManager.loadAll(assetManifest);
    initSystems();

    renderer.canvas.addEventListener("mouseup", (e) => {
        if (camera.hasDragged) {
            camera.endInteraction();
            return;
        }

        const rect = renderer.canvas.getBoundingClientRect();

        const screenPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        const worldPos = camera.screenToWorld(screenPos);

        interactionSystem(worldPos, camera);

        camera.endInteraction();
    });
}

function loop(deltaTime) {
    if (!gameState.gameStart) return;

    if (gameState.currentFace === "A") {
        gameState.currentTime = Math.max(0, gameState.currentTime - deltaTime);

        const clampedDelta = Math.min(deltaTime, 0.033); // máximo ~30 FPS

        timeSystem(clampedDelta);

        runSystems(clampedDelta, camera);

        movementSystem(clampedDelta);

        camera.clamp(
            worldState.grid.worldWidth,
            worldState.grid.worldHeight,
            renderer.canvas.width,
            renderer.canvas.height
        );

        updateGrid(clampedDelta);

        combatSystem(clampedDelta);

        renderer.render(worldState, camera, gameState.selectedEntityId);
    }
}

export { init };
export default loop;