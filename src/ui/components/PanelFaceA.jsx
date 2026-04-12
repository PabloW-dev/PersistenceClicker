// interfaz de la cara A
// Face A interface
import React, { useEffect, useRef, useState } from 'react';
import startLoop from "../../hooks/useGameLoop.js"
import { init } from '../../engine/core/GameManager.js';
import useGameStateA from '../../hooks/useStateA.js';
import { on } from '../../utils/events.js';

export default function PanelFaceA() {
    const canvasRef = useRef(null); //preparar la constante
    const [floatingTexts, setFloatingTexts] = useState([]);
    const state = useGameStateA();

    useEffect(() => {
        init(canvasRef.current); //meterle la constante cuando sí existe
        startLoop();
        
        const unsubscribe = on("timeGained", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `+${data.value} sec`,
                    x: data.pos.x,
                    y: data.pos.y
                }
            ]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 500);
        });

        return () => unsubscribe();
    }, []);

    if (state.currentFace !== "A") return null;

  return (
    <div className="game-container">
        <p>Time: {state.currentTime.toFixed(2)}</p>

        {floatingTexts.map(t => (
            <p 
                key={t.id} 
                className="floating-text"
                style={{
                    left: t.x,
                    top: t.y
                }}
            >
                {t.text}
            </p>
        ))}

        <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  ); //el número currentTime se convierte a un string de 2 decimales
}