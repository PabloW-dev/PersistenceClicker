import React, { useEffect, useRef } from 'react';
import startLoop, { stopLoop } from "../../hooks/useGameLoop.js";
import { init } from "../../engine/core/GameManager.js";
import EmitText from './EmitText.jsx';
import HUD from './HUD';
import FaceSwitcher from './FaceSwitcher';

export default function GameRoot() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
    
        init(canvasRef.current); //meterle la constante cuando sí existe
        startLoop();

        return () => {
            stopLoop();
        };
    }, []);
  return (
    <div>
      <HUD />

      <EmitText />
      
      <canvas ref={canvasRef} width={800} height={600}></canvas>
      
      <FaceSwitcher />
    </div>
  )
}
