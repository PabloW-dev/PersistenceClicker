// interfaz principal, muestra recursos, score y tiempo
// main interface, displays resources, score and time

import React, { useEffect, useState } from 'react';
import useGameStateA from '../../hooks/useState';

export default function HUD() {
    const state = useGameStateA();
    const [shake, setShake] = useState(false);

    const lastTrigger = state.timeShakeTrigger;


    useEffect(() => {
      if (!lastTrigger) return;

      setShake(false);

      const frame = requestAnimationFrame(() => {
        setShake(true);
      });

      const t = setTimeout(() => {
        setShake(false);
      }, 120);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(t);
      };
    }, [lastTrigger]);

  return (
    <div>
      <p>EXP: {state.currentExp.toFixed(2)}</p>
      <p className={`time ${shake ? "shake flash" : ""}`}>Time: {state.currentTime.toFixed(2)}</p>
    </div>
  );
}
