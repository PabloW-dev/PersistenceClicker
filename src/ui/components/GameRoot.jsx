import React, { useEffect, useRef } from 'react';
import startLoop, { stopLoop } from "../../hooks/useGameLoop.js";
import gameStateB from '../../game/faceB/state/GameStateB.js';
import { cancelBuildMode } from '../../game/faceB/systems/ConstructionSystem.js';
import { init } from "../../engine/core/GameManager.js";
import EmitText from './EmitText.jsx';
import HUD from './HUD';
import FaceSwitcher from './FaceSwitcher';
import FaceInformationSwitcher from './FaceInformationSwitcher.jsx';
import ASideBackground from "../../assets/sprites/FondoInterfazA.png";
import BSideBackground from "../../assets/sprites/FondoInterfazB.png";
import gameState from '../../game/state/GameStateG.js';

export default function GameRoot() {
    const canvasRef = useRef(null);

    useEffect(() => {

      const handleOutsideClick = (e) => {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const clickedInsideCanvas = canvas.contains(e.target);

        if (
          gameStateB.buildMode.active &&
          !clickedInsideCanvas
        ) {
          cancelBuildMode();
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };

    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
    
        init(canvasRef.current); //meterle la constante cuando sí existe
        startLoop();

        return () => {
            stopLoop();
        };
    }, []);

    useEffect(() => { 
        function resizeGame() { const wrapper = document.querySelector(".canvas-wrapper");
          if(!wrapper) return; 

          const scaleX = window.innerWidth / 1350;

          const scaleY = window.innerHeight / 800;
          
          const scale = Math.min(scaleX, scaleY);
           
          wrapper.style.width = `${1350 * scale}px`;
          wrapper.style.height = `${800 * scale}px`;
          wrapper.style.transform = `scale(${scale})`;
        } 
        
        resizeGame(); 
        
        window.addEventListener("resize", resizeGame); 
        
        return () => {
          window.removeEventListener("resize", resizeGame); 
        };

    }, []);

    useEffect(() => {
        const reinit = () => {
            if (!canvasRef.current) return;

            init(canvasRef.current);
        };

        window.addEventListener("engineReinit", reinit);
        return () => window.removeEventListener("engineReinit", reinit);
    }, []);

  return (
    <div className="game-layout-container" style={{
        backgroundImage: 
          gameState.currentFace === "A" || gameState.currentFace === "T"
            ? `url(${ASideBackground})`
            : `url(${BSideBackground})`
        }}>

      <div className="game-layout-container__main"> 
        <div className="game-layout-container__info">
          <HUD />
          <FaceInformationSwitcher />
        </div>

        <div className="game-layout canvas-scale-wrapper">
          <div className="canvas-wrapper">
            <EmitText />

            <canvas ref={canvasRef} width={1350} height={800}></canvas>
          </div>
        </div>
      
      </div> 

      <aside className="sidebar">
        <FaceSwitcher />
      </aside>
    </div>
  )
}
