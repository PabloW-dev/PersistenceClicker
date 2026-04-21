// interfaz de la cara A
// Face A interface
import React, { useEffect, useRef } from 'react';
import startLoop from "../../hooks/useGameLoop.js"
import { init } from '../../engine/core/GameManager.js';
import useGameStateA from '../../hooks/useStateA.js';
import EmitText from './EmitText.jsx';

export default function PanelFaceA() {
    const canvasRef = useRef(null); //preparar la constante
    const state = useGameStateA();

    useEffect(() => {
        init(canvasRef.current); //meterle la constante cuando sí existe
        startLoop();
    }, []);

    if (state.currentFace !== "A") return null;

  return (
    <div className="game-container">
        <p>Time: {state.currentTime.toFixed(2)}</p>

        <EmitText />

        <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  ); //el número currentTime se convierte a un string de 2 decimales
}