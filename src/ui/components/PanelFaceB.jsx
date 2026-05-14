// paneles de control de FaceB
// FaceB control panels
import React from 'react';
import useGameState from '../../hooks/useState';
import BuildingButtons from './BuildingButtons';



export default function PanelFaceB() {
  const state = useGameState();

  if(state.currentFace !== "B") return null;
  
  return (
    <div className="face-panel">
      <BuildingButtons />
    </div>
  )
}
