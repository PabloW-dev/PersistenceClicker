// hook para ejecutar el loop principal del juego
// hook to run the main game loop

import loop from "../engine/core/GameManager.js";

function startLoop() {
    let last = performance.now(); //obtener tiempo actual en milisegundos, guardando el tiempo del frame anterior

    function tick(now) { //esto se ejecuta cada frame
        const dt = (now - last) / 1000; //deltaTime, al frame actual le restamos el frame anterior para no depender de FPS
        last = now; // actualizamos el frame anterior

        loop(dt); //y le pasamos dt a loop para que empiece a ejecutarse cada vez qeu se ejecute startLoop

        requestAnimationFrame(tick); //esto ahce que tick se autollame en cada frame, esto resulta lo que lo mueve
    }

    requestAnimationFrame(tick);
}

export default startLoop;