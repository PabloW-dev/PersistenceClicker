// paneles de control de FaceB
// FaceB control panels


//TO DO: Repair button (show when the player has been at least 2 times at the entrophy)
//TO DO: paths button (show when there are at least two buildings in the world)
//TO DO: shovel button (can erase buildings and paths) (show with the repair button, better moment)

import React from 'react';
import useGameState from '../../hooks/useState';
import BuildingButtons from './BuildingButtons';
import SpecialBuildingButtons from './SpecialBuildingButtons';
import Requirements from './Requirements';


export default function PanelFaceB() {
  const state = useGameState();

  if(state.currentFace !== "B") return null;
  
  return (
    <div className="face-panel">
      <h3>Buildings</h3>
      <BuildingButtons />
      <h3>Special Buildings</h3>
      <SpecialBuildingButtons />
      <Requirements />
    </div>
  )
}
