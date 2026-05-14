// coordinación general del juego, gestión de flujo entre FaceA y FaceB
// general game coordination, flow management between FaceA and FaceB
import CanvasRenderer from "../renderer/CanvasRenderer.js";
import interactionSystem from "../systems/InteractionSystem.js";
import spawnAnimationSystem from "../../game/faceA/systems/SpawnAnimationSystem.js";
import gameState from "../../game/state/GameStateG.js";
import worldState from "../../game/world/WorldState.js";
import { updateGrid } from "../../game/world/Map.js";
import Camera from "../camera/Camera.js";
import AssetsManager from "../../assets/AssetsManager.js";
import assetManifest from "../../assets/AssetsManifest.js";
import timeSystem from "../systems/TimeSystem.js";
import movementSystem from "../systems/MovementSystem.js";
import { initSystemsA, runSystemsA } from "../../game/faceA/systems/SystemAManager.js";
import { initSystemsB, runSystemsB } from "../../game/faceB/systems/SystemBManager.js";
import ExpSystem from "../systems/ExpSystem.js";
import changeFace from "../scenes/SceneManager.js";
import { updateBuildMode } from "../../game/faceB/systems/ConstructionSystem.js";


let renderer = null;
let camera = null;

function init(canvas) {
    renderer = new CanvasRenderer(canvas);
    camera = new Camera(renderer.canvas);

    AssetsManager.loadAll(assetManifest);
    initSystemsA();
    initSystemsB();

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

    renderer.onMouseMove = (screenPos) => {
        const worldPos = camera.screenToWorld(screenPos);

        updateBuildMode(worldPos);
    };
}

function loop(deltaTime) {
    if (!renderer || !camera) return;

    if (gameState.gameStart) {
        gameState.currentTime = Math.max(0, gameState.currentTime - deltaTime);

        const clampedDelta = Math.min(deltaTime, 0.033); // máximo ~30 FPS

        timeSystem(clampedDelta);
        ExpSystem(clampedDelta);

        runSystemsA(clampedDelta, camera);
        runSystemsB(clampedDelta, camera);

        spawnAnimationSystem(clampedDelta);

        movementSystem(clampedDelta);

        camera.clamp(
            worldState.grid.worldWidth,
            worldState.grid.worldHeight,
            renderer.canvas.width,
            renderer.canvas.height
        );

        if (gameState.currentFace === "B" && !worldState.tileMap) {
            changeFace();
        }

        updateGrid(clampedDelta);

        renderer.render(worldState, camera, gameState.selectedEntityId);
    }
}

export { init };
export default loop;