// interfaz de la cara A
// Face A interface
import React from 'react';
import useGameState from '../../hooks/useState.js';
import { ProcessPanel } from './ProcessPanel.jsx';
import { ARCHETYPES } from '../../game/faceA/systems/ArchetypeDefinition.js';


export default function PanelFaceA() {
  const state = useGameState();
  const archetypes = ARCHETYPES;


  if (state.currentFace !== "A") return null;

  return (
    <div>
        <ProcessPanel archetypes={archetypes} state={state} />
    </div>
  );
}