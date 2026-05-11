import React, { useEffect, useRef } from 'react';
import startLoop, { stopLoop } from "../../hooks/useGameLoop.js";
import { init } from "../../engine/core/GameManager.js";
import EmitText from './EmitText.jsx';
import HUD from './HUD';
import FaceSwitcher from './FaceSwitcher';
import FaceInformationSwitcher from './FaceInformationSwitcher.jsx';

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
    <>
      <HUD />
      <FaceInformationSwitcher />

      <div className="canvas-wrapper">
        <EmitText />
      
        <canvas ref={canvasRef} width={1400} height={800}></canvas>
      </div>
      
      <FaceSwitcher />
    </>
  )
}
