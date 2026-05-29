// Transiciones

import fadeState from "./FadeState";

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

export function startSceneTransition(callback) {
    if(fadeState.active) return;
    
    fadeState.active = true;
    fadeState.mode = "out";
    fadeState.callback = callback;
}