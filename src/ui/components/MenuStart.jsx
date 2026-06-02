// menú inicial antes de empezar la partida
// main initial menú before starting the game

import React from 'react'
import gameState from '../../game/state/GameStateG'
import worldState from '../../game/world/WorldState';
import createTower from '../../game/faceA/entities/Tower';
import { tutorial } from '../../game/tutorials/TutorialState';
import SaveManager from '../../engine/persistence/SaveManager';
import { emit } from '../../utils/events';
import Logo from "../../assets/sprites/Logo.png";
import MenuBackGround from "../../assets/sprites/FondoMenu.png";
import { applySocialRewards } from '../../game/shared/MetaResources';

function startNewGame() {

    SaveManager.deleteSave();

    gameState.gameStart = true;
    gameState.currentFace = "A";

    worldState.structures.length = 0;

    worldState.structures.push(
        createTower()
    );

    applySocialRewards();

    window.dispatchEvent(
        new Event("gameStateChange")
    );
}

export default function MenuStart() {
  return (
    <div className="menu-container" style={{backgroundImage: `url(${MenuBackGround})`}}>
      <img 
        src={Logo}
        alt="Persistence Clicker.
        Time cannot be beaten... Only delayed..."
        className="menu-logo"
      />

      <div className="menu-buttons">
        <button 
          className="process-button" 
          onClick={() => {

              if(SaveManager.hasSave()) {
                emit("openModal", {
                  type: "confirm"
                });

                return;
              }

              startNewGame();
          }}>
          {SaveManager.hasSave() 
          ? "Erase Data For New Game"
          : "New Game"}
        </button>

        <button
          className="process-button"
          disabled={!SaveManager.hasSave()}
          onClick={() => {
            if(!SaveManager.hasSave()) return;

            SaveManager.loadGame();

            window.dispatchEvent(new Event("gameStateChange"));
          }}>
          Continue Game
        </button>

        <button 
          className="process-button" 
          onClick={() => {
            if(!tutorial.AtutorialComplete) {
            gameState.gameStart = true;
            gameState.currentFace = "T";
            gameState.firstRun = true;
            worldState.structures.length = 0;
            worldState.structures.push(createTower());
            window.dispatchEvent(new Event("gameStateChange"));
          }}}>
            {!tutorial.AtutorialComplete ? "Tutorial of The Entropy" : "Completed!"} 
        </button>

        <button
          className="process-button"
          onClick={() => {
            emit("openModal", {
              type: "RRSS"
            })}}
        >
          Support the Project
        </button>
      </div>

      <p className="menu-dev">
        © 2026 PabloW-dev. All rights reserved.
      </p>
    </div>
  ) //poner enlaces a redes sociales
}
