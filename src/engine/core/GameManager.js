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
import { initSystemsT, runSystemsT } from "../../game/tutorials/systemTManager.js";
import ExpSystem from "../systems/ExpSystem.js";
import { updateBuildMode } from "../../game/faceB/systems/ConstructionSystem.js";
import { influenceSystem } from "../systems/InfluenceSystem.js";
import TransitionSystem from "../scenes/TransitionManager.js";
import fadeState from "../scenes/FadeState.js";
import { tutorial } from "../../game/tutorials/TutorialState.js";
import AutoSave from "../persistence/AutoSave.js";
import SaveManager from "../persistence/SaveManager.js";


let renderer = null;
let camera = null;
let currentCanvas = null;
let beforeUnloadRegistered = false;
let mouseUpHandler = null;

function init(canvas) {
    if (renderer && currentCanvas === canvas) return;

    console.log(worldState.structures.length);

    currentCanvas = canvas;

    if (renderer && mouseUpHandler) {
        renderer.canvas.removeEventListener("mouseup", mouseUpHandler);
    }

    renderer = new CanvasRenderer(canvas);
    camera = new Camera(renderer.canvas);

    AssetsManager.loadAll(assetManifest);

    initSystemsA();
    initSystemsB();
    initSystemsT();

    AutoSave.startAutoSave();

    if(!beforeUnloadRegistered) {

        window.addEventListener("beforeunload", () =>  {

            if(!gameState.gameStart) return;
            if(gameState.currentFace === "T") return;
            if (fadeState.active) return;

            SaveManager.saveGame();
        })

        beforeUnloadRegistered = true;
    }

    mouseUpHandler = (e) => {
        if (camera.hasDragged) {

            if(gameState.currentFace === "T" && tutorial.step === 1) {
                tutorial.cameraMoved = true;
            }

            camera.endInteraction();
            return;
        }

        const rect = renderer.canvas.getBoundingClientRect();

        const scaleX = renderer.canvas.width / rect.width;
        const scaleY = renderer.canvas.height / rect.height;

        const screenPos = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };

        const worldPos = camera.screenToWorld(screenPos);

        const inputLocked = gameState.gamePause || fadeState.active;

        if (!inputLocked) {
            interactionSystem(worldPos, camera);
        }

        camera.endInteraction();
    };

    
    renderer.canvas.addEventListener("mouseup", mouseUpHandler);
    

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

        if(!gameState.gamePause) {
            timeSystem(clampedDelta, camera);
            ExpSystem(clampedDelta);

            runSystemsA(clampedDelta, camera);
            runSystemsB(clampedDelta, camera);
            runSystemsT(clampedDelta, camera);

            spawnAnimationSystem(clampedDelta);

            movementSystem(clampedDelta);

            camera.clamp(
                worldState.grid.worldWidth,
                worldState.grid.worldHeight,
                renderer.canvas.width,
                renderer.canvas.height
            );

            updateGrid(clampedDelta);

            influenceSystem(clampedDelta);
        }

        TransitionSystem(clampedDelta);

        renderer.render(worldState, camera, gameState.selectedEntityId);
    }
}

export { init };
export default loop;