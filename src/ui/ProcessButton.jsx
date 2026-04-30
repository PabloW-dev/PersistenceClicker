//dinamic buttons for summon and leveling processes
import React from "react";
import PropTypes from "prop-types";
import worldState from "../game/world/WorldState";
import gameState from "../game/state/GameStateG";
import { startProcess } from "../game/faceA/LogicA";
import { restTime } from "../game/LogicG";



ProcessButton.propTypes = {
    archetype: PropTypes.object.isRequired,
    state: PropTypes.shape({
        currentTime: PropTypes.number,
        activeProcesses: PropTypes.array,
        currentFace: PropTypes.string
    }).isRequired
};

function hasArchetype(archetype) {
    return worldState.entities.some(
        e => e.type === "archetype" && e.data.archetypeId === archetype.id
    );
}


export function ProcessButton({ archetype, state }) {
    const activeProcesses = state.activeProcesses;
    
    const resurrectProcess = activeProcesses.find(
        p => p.type === "resurrect" &&
        p.payload?.archetypeId === archetype.id
    );

    const normalProcess = activeProcesses.find(
        p => p.type !== "resurrect" &&
        p.payload?.archetypeId === archetype.id
    );

    const investigateProcess = activeProcesses.find(
        p => p.type === "investigate" &&
        p.payload?.archetypeId === archetype.id
    );

    const process = 
        resurrectProcess || 
        investigateProcess || 
        normalProcess; 
        //priorizing resurrect type
    

    function handleClick() {
        gameState.selectedEntityId = null;

        if(!process) {
            if(!hasArchetype(archetype)) {
                startProcess("summon", archetype);
            } else {
                startProcess("levelup", archetype)
            }
        } else {
            restTime(process);
        }
    }

    let label;

    if(process) {
        console.log(process.type);
        if (process.type === "resurrect") label = "Reviving";
        else if (process.type === "investigate") label = "Investigating";
        else label = "Add Time";
    } else if (!hasArchetype(archetype)) {
        label = `Summon ${archetype.name}`;
    } else {
        label = `Train ${archetype.name}`;
    }

    const progress = process
        ? Math.min(process.progress / process.duration, 1)
        : 0;

    const remaining = process
        ? Math.ceil(process.duration - process.progress)
        : 0;

    return (
        <button className="process-button" onClick={handleClick}>
            {process && (
                <div
                    className="progress-fill"
                    style={{ width: `${progress * 100}%` }}
                />
            )}

            <span className="label">
                {label}
                {process && `(${remaining}s)`}
            </span>
        </button>
    );
}