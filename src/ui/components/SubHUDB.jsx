import React from 'react';
import gameStateB from '../../game/faceB/state/GameStateB';
import worldState from '../../game/world/WorldState';
import { getVillagerCost } from '../../game/faceB/LogicB';
import { POPULATION } from '../../game/faceB/systems/PopulationSystem';


export default function SubHUDB() {
    const nextCost = getVillagerCost(worldState);

  return (
    <div className="subhud">
        <p className="subhud__exp">Stored EXP: {gameStateB.EXPinCenterTown.toFixed(0)}</p>
        <div className="subhud__element" />
        <p className="subhud__villager">Next Villager: {nextCost.toFixed(0)}</p>

        <p className="subhud__population">POPULATION: {POPULATION.villagers.currentPopulation} / {POPULATION.villagers.getCurrentMax()} </p>
    </div>
  );
}
