// Transiciones
import worldState from "../../game/world/WorldState";
import gameState from "../../game/state/GameStateG";
import fadeState from "./FadeState";
import darkBell from "../../assets/sounds/darkBell.mp3";

const FADE_DURATION = 1;

export default function TransitionSystem(deltaTime) {
    if(!fadeState.active) return;

    if(fadeState.mode === "out") {
        fadeState.opacity += deltaTime / FADE_DURATION;

        if(fadeState.opacity >= 1) {
            fadeState.opacity = 1;

            if(fadeState.callback) {
                fadeState.callback();
                fadeState.callback = null;
            }

            fadeState.mode = "in";
        }

        return;
    }

    if (fadeState.mode === "in") {
        fadeState.opacity -= deltaTime / FADE_DURATION;

        if(fadeState.opacity <= 0) {
            fadeState.opacity = 0;
            fadeState.mode = null;
            fadeState.active = false;
        }
    }
}

export function startSceneTransition(callback, camera) {
    if(fadeState.active) return;

    if(gameState.currentFace === "A") {
        const tower = worldState.structures.find(
            s => s.id === "tower"
        );

        // cámara a torre
        if (tower) {
            camera.x = tower.x;
            camera.y = tower.y;
        }

        //meter el sonido de la campana
        const bell = new Audio(darkBell);

        bell.play();

        //esperar a que termine de sonar para empezar la transición
        bell.onended = () => {
            fadeState.active = true;
            fadeState.mode = "out";
            fadeState.callback = callback;
        };

        return;
    }
    
    fadeState.active = true;
    fadeState.mode = "out";
    fadeState.callback = callback;
}