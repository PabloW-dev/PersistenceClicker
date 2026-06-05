// menú inicial antes de empezar la partida
// main initial menú before starting the game

import React, { useRef } from 'react'
import gameState from '../../game/state/GameStateG'
import worldState from '../../game/world/WorldState';
import createTower from '../../game/faceA/entities/Tower';
import { tutorial } from '../../game/tutorials/TutorialState';
import SaveManager from '../../engine/persistence/SaveManager';
import { emit } from '../../utils/events';
import Logo from "../../assets/sprites/Logo.png";
import MenuBackGround from "../../assets/sprites/FondoMenu.png";
import { applySocialRewards, metaResources } from '../../game/shared/MetaResources';
import useTimeCrack from '../effects/TimeCrack';
import { hideHint } from '../../game/tutorials/tutorials';
import gameStateA from '../../game/faceA/state/GameStateA';

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
  const menuRef = useRef(null);

  useTimeCrack(menuRef);

  return (
    <div ref={menuRef} className="menu-container" style={{backgroundImage: `url(${MenuBackGround})`}}>

      <img 
        src={Logo}
        alt="Persistence Clicker.
        Time cannot be beaten... Only delayed..."
        className="menu-logo"
      />

      <div className="menu-buttons">
        <button 
          className="process-button menu" 
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
          className="process-button menu"
          disabled={!SaveManager.hasSave()}
          onClick={() => {
            if(!SaveManager.hasSave()) return;

            SaveManager.loadGame();

            applySocialRewards();

            setTimeout(() => {
              window.dispatchEvent(new Event("gameStateChange"));
              window.dispatchEvent(new Event("engineReinit"));
            }, 0);
          }}>
          Continue Game
        </button>

        <button 
          className={`process-button menu 
            ${!metaResources.tutorialFirstCompleted 
                ? "tutorial-highlight"
                : ""
            }`
          }
          onClick={() => {
            if(!tutorial.AtutorialComplete) {
              if(gameStateA.hint.active) {
                hideHint();
              }
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
          className="process-button menu"
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
  )
}
