// interfaz principal, muestra recursos, score y tiempo
// main interface, displays resources, score and time

import React from 'react';
import useGameStateA from '../../hooks/useStateA';

export default function HUD() {
    const state = useGameStateA();

  return (
    <div>
      <p>EXP: {state.currentExp.toFixed(2)}</p>
    </div>
  );
}
