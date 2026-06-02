//for tutorials of the game

import { changeToM } from "../../engine/scenes/SceneManager";
import { startSceneTransition } from "../../engine/scenes/TransitionManager";
import gameStateA from "../faceA/state/GameStateA";
import gameState from "../state/GameStateG";
import worldState from "../world/WorldState";
import { tutorial } from "./TutorialState";

let timer = 0;

export function updateTutorialA(deltaTime) {
    if(gameState.currentFace !== "T") return;

    if (tutorial.step === 0) {
        timer += deltaTime;

        if (timer >= 5) {
            showHintOnTower();
        }
    }

    if (tutorial.step === 0 && tutorial.towerClicked && gameState.statistics.totalExp >= 0.3) {
        tutorial.step = 1;
    }
    
    if (tutorial.step === 1) {
        timer += deltaTime;

        if (timer >= 5 && !gameStateA.hint.active) {
            showHint({
                type: "drag",
                x: 925,
                y: 750
            });
        }
    }

    if (tutorial.cameraMoved && tutorial.step === 1) {
        hideHint();

        tutorial.step = 2;
    }

    if (tutorial.step === 2) {
        if(!gameStateA.hint.active) {
            showHint({
                type: "dom",
                targetId: "summon-protagonist"
            });
        }
    }

    if (tutorial.step === 2 && gameState.activeProcesses.length > 0) {
        tutorial.archetypeButtonClicked = true;
    }

    const summoned = worldState.entities.find(e => e.id === "protagonist");

    if (tutorial.step === 2 && summoned) {
        tutorial.archetypeSummoned = true;

        hideHint();

        tutorial.step = 3;
    }

    if (tutorial.step === 3) {
        timer += deltaTime;

        if(timer > 5 && !gameStateA.hint.active) {
            showHint({
                type: "click",
                x: summoned.x - 10,
                y: summoned.y - 40
            });
        }
    }

    if (tutorial.step === 3 && gameState.selectedEntityId) { //esto funciona por lo mismo, sólo se puede seleccionar a protagonist
        hideHint();

        if(gameState.selectedEntityId && !gameStateA.hint.active) {
            showHint({ //esto resulta lo complicado, protagonist puede aparecer en cualquier punto alrededor de la torre, así que va a resultar un tema indicar al jugador un punto vacío para hacer el click, supongo que vale con ponerlo lo suficiente lejos para que salga donde salga nunca aparezca en la torre
                type: "click",
                x: summoned.x + 200,
                y: summoned.y
            });
        } //de esta manera, esta mano sólo aparecerá si protagonist está seleccionado, si el jugador deseleccionase, no aparece (porque puede deseleccionar tanto para moverlo como para pulsar la interfaz o un punto inválido), de tal forma que volvería a aparecer la mano sobre the protagonist, y volvería a aparecer en el mismo punto, así hasta que el jugador mueva a the protagonist, en cuyo caso:
    }

    if(tutorial.step === 3 && summoned.data.state === "moving") { //este resulta el único check para saber de verdad si se ha movido
        hideHint();

        tutorial.archetypeMoved = true;

        tutorial.step = 4;
    }

    const drainingShadow = worldState.entities.find(
        e => e.type === "shadow" && e.data.drainAccum > 0
    );

    if(tutorial.step === 4 && drainingShadow) {
        timer += deltaTime;

        if(timer > 5 && !gameStateA.hint.active) {
            showHint({
                type: "click",
                x: drainingShadow.x - 10,
                y: drainingShadow.y - 40
            });
        }
    }

    if(tutorial.step === 4 && drainingShadow?.data.clicks < 2) {
        hideHint();
        tutorial.shadowClicked = true;

        tutorial.step = 5;
    }

    if(tutorial.step === 5) {
        timer += deltaTime;

        if(timer > 60) {
            tutorial.AtutorialComplete = true;
            timer = 0;
            console.log("cambio");

            startSceneTransition(() => changeToM());
        }
    }
}

export function showHint({type, x, y, targetId = null}) {
    gameStateA.hint.active = true;
    gameStateA.hint.type = type;
    gameStateA.hint.targetId = targetId;
    gameStateA.hint.x = x;
    gameStateA.hint.y = y;
    gameStateA.hint.startTime = performance.now();
}

export function hideHint() {
    gameStateA.hint.active = false;
    gameStateA.hint.type = null;
    gameStateA.hint.targetId = null;
    gameStateA.hint.x = 0;
    gameStateA.hint.y = 0;
    gameStateA.hint.startTime = 0;
    timer = 0;
}

function showHintOnTower() {
    const tower = worldState.structures.find(s => s.type === "tower");

    if (!tower) return;

    showHint({
        type: "click",
        targetId: tower.id,
        x: tower.x - 20,
        y: tower.y - 70
    });
}