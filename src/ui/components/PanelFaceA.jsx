// interfaz de la cara A
// Face A interface
import React, { useEffect, useRef, useState } from 'react';
import startLoop from "../../hooks/useGameLoop.js";
import { init } from '../../engine/core/GameManager.js';
import useGameStateA from '../../hooks/useStateA.js';
import EmitText from './EmitText.jsx';
import { ProcessPanel } from './ProcessPanel.jsx';
import { ARCHETYPES } from '../../game/faceA/systems/ArchetypeDefinition.js';


export default function PanelFaceA() {
    const canvasRef = useRef(null); //preparar la constante
    const state = useGameStateA();
    const archetypes = ARCHETYPES;

    const [shake, setShake] = useState(false);
    const lastTrigger = state.timeShakeTrigger;

    useEffect(() => {
      init(canvasRef.current); //meterle la constante cuando sí existe
      startLoop();
    }, []);

    useEffect(() => {
      if (!lastTrigger) return;

      setShake(false);

      const frame = requestAnimationFrame(() => {
        setShake(true);
      });

      const t = setTimeout(() => {
        setShake(false);
      }, 120);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(t);
      };
    }, [lastTrigger]);

    if (state.currentFace !== "A") return null;

  return (
    <div className="game-container">
        <p className={`time ${shake ? "shake flash" : ""}`}>Time: {state.currentTime.toFixed(2)}</p>

        <EmitText />

        <canvas ref={canvasRef} width={800} height={600}></canvas>

        <ProcessPanel archetypes={archetypes} state={state} />
    </div>
  ); //el número currentTime se convierte a un string de 2 decimales
}