// coordinación general del juego, gestión de flujo entre FaceA y FaceB
// general game coordination, flow management between FaceA and FaceB
import CanvasRenderer from "../renderer/CanvasRenderer.js";
import gameState from "../../game/state/GameStateG.js";
import handleClick from "../systems/InteractionSystem.js";


let renderer = null; //preparar la variable


function init(canvas) { //esto resulta para que no inicie la función antes del renderizado del DOM, porque si no, no existe el canvas aún
    renderer = new CanvasRenderer(canvas);

    // conection for clicks
    renderer.onClick = (pos) => {
        handleClick(pos);
    };
}

function loop(deltaTime) {
    if (!gameState.gameStart) return;

    //Face A time logic
    if (gameState.currentFace === "A" ) {
        gameState.currentTime = Math.max(0, gameState.currentTime - deltaTime);

        console.log(gameState.currentTime);
    }
}

export { init };
export default loop;