import React, { useEffect, useState } from 'react';
import gameState from '../../game/state/GameStateG';
import { on } from '../../utils/events';
import { tutorial } from '../../game/tutorials/TutorialState';

export default function EmitText() {
    const [floatingTexts, setFloatingTexts] = useState([]);

    useEffect(() => {

        const unsubscribeGain = on("timeGained", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `+${data.value} SEC`,
                    x: data.pos.x,
                    y: data.pos.y
                }
            ]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 1500);
        });

        const unsubscribeTutorialGain = on("tutorialTimeGained", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `+${data.value} SEC!!`,
                    x: data.pos.x,
                    y: data.pos.y
                }
            ]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 1500);
        });

        const unsubscribeDrain = on("timeDrained", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `-${data.value.toFixed(1)} SEC`,
                    x: data.pos.x,
                    y: data.pos.y
                }
            ]);

            
            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 1500);
        });

        const unsubscribeLost = on("EXPlosted", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `-${data.value} EXP`,
                    x: data.pos.x,
                    y: data.pos.y
                }
            ]);

            
            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 1500);
        });

        const unsubscribeEXP = on("EXPgained", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `+${data.value} EXP!!`,
                    x: data.pos.x,
                    y: data.pos.y
                } 
            ]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 5000);
        });

        return () => {
            unsubscribeGain();
            unsubscribeTutorialGain();
            unsubscribeDrain();
            unsubscribeLost();
            unsubscribeEXP();
        };
    }, []);

    return (
        <div className={`floating-layer ${gameState.currentFace === "T" && tutorial.step === 0 ? "big" : ""}`}  >
            {floatingTexts.map(t => (
                <p
                    key={t.id}
                    className={`floating-text ${gameState.currentFace === "A" || gameState.currentFace === "T" ? "A" : "B"}`}
                    style={{
                        left: `${t.x}px`,
                        top: `${t.y}px`
                    }}
                >
                    {t.text}
                </p>
            ))}
        </div>
    );
}