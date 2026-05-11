// interfaz principal, muestra recursos, score y tiempo
// main interface, displays resources, score and time

import React, { useEffect, useState } from 'react';
import useGameStateA from '../../hooks/useState';

export default function HUD() {
    const state = useGameStateA();
    const [timeShake, setTimeShake] = useState(false);
    const [expShake, setExpShake] = useState(false);

    const lastTriggerTime = state.timeShakeTrigger;
    const lastTriggerExp = state.timeShakeTriggerEXP;
    //TIME:
    useEffect(() => {
      if (!lastTriggerTime) return;

      setTimeShake(false);

      const frame = requestAnimationFrame(() => {
        setTimeShake(true);
      });

      const t = setTimeout(() => {
        setTimeShake(false);
      }, 120);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(t);
      };
    }, [lastTriggerTime]);

    useEffect(() => {
      if (!lastTriggerExp) return;

      setExpShake(false);

      const frame = requestAnimationFrame(() => {
        setExpShake(true);
      });

      const t = setTimeout(() => {
        setExpShake(false);
      }, 120);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(t);
      };
    }, [lastTriggerExp]);

  return (
    <div>
      <p className={`exp ${expShake ? "shake flash" : ""}`}
      >EXP: {state.currentExp.toFixed(2)}</p>
      <p className={`time ${timeShake ? "shake flash" : ""}`}>Time: {state.currentTime.toFixed(2)}</p>
    </div>
  );
}
