import React from 'react'
import { tutorial } from '../../game/tutorials/TutorialState'
import worldState from '../../game/world/WorldState'

export default function Requirements() {
    const sundial = worldState.structures.find(s => s.id === "sundial");

    if(!sundial) return null;

  return (
    <div className="face-panel__buildings">
      {tutorial.sundialPlaced && !tutorial.sundialReady
      ? (<p>
        Mats For Can Build:
          {Object.entries(sundial.data.matsRequired).map(([key, value]) => (
            <span key={key}> {key}: {value} </span>
          ))}
      </p>
      ) : tutorial.sundialReady && !tutorial.sundialBuilt 
      ? (<p>
        For complete Build: {sundial.data.hp} / {sundial.data.hpMax}
      </p>
      ) : null}
    </div>
  )
}
