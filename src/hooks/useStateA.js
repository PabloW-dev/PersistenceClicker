// hook para estados de A
// hook for states of A
import { useState, useEffect } from "react";
import gameState from "../game/state/GameStateG.js";

export default function useGameStateA() {
    const [, forceRender] = useState(0);

    useEffect(() => { //se ejecuta 1 vez al empezar el juego
        const id = setInterval(() => { //ejecuta forceRender cada 10 FPS
            forceRender(t => t + 1); //sumamos 1 a t para que react detecte un cambio de estado
        }, 100); // UI ticks (10 FPS)

        return () => clearInterval(id); //si no está el componente, para, esto evita que lo entienda como un loop infinito
    }, []);

    return gameState; // React lo lee en cada re-render forzado (contiene currentTime actualizado)
}