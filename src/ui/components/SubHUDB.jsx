import React from 'react';
import gameStateB from '../../game/faceB/state/GameStateB';
import worldState from '../../game/world/WorldState';
import { getVillagerCost } from '../../game/faceB/LogicB';
import { POPULATION } from '../../game/faceB/systems/PopulationSystem';


export default function SubHUDB() {
    const nextCost = getVillagerCost(worldState);

  return (
    <div>
        <p>Stored EXP: {gameStateB.EXPinCenterTown.toFixed(0)}</p>
        <p>Next Villager: {nextCost.toFixed(0)}</p>

        <p>POPULATION: {POPULATION.villagers.currentPopulation} / {POPULATION.villagers.currentMaxPopulation} </p>
    </div>
  );
}
