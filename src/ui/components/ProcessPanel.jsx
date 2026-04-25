import React from 'react';
import PropTypes from "prop-types";
import { ProcessButton } from '../ProcessButton';
import { shouldShowArchetype } from '../../game/LogicG';

ProcessPanel.propTypes = {
    archetypes: PropTypes.object.isRequired,
    state: PropTypes.shape({
            currentTime: PropTypes.number,
            activeProcesses: PropTypes.array,
            currentFace: PropTypes.string
        }).isRequired
};

export function ProcessPanel({ archetypes, state }) {
  return (
    <>
      {archetypes?.filter(a => shouldShowArchetype(a, state)).map(a => (
        <ProcessButton key={a.id} archetype={a} state={state} />
    ))}
    </>
  );
}
