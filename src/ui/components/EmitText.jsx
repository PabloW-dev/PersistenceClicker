import React, { useEffect, useState } from 'react';
import { on } from '../../utils/events';

export default function EmitText() {
    const [floatingTexts, setFloatingTexts] = useState([]);

    useEffect(() => {
        const unsubscribeGain = on("timeGained", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `+${data.value} sec`,
                    x: data.pos.x,
                    y: data.pos.y
                }
            ]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 500);
        });

        const unsubscribeDrain = on("timeDrained", (data) => {
            const id = crypto.randomUUID();

            setFloatingTexts(prev => [
                ...prev,
                {
                    id,
                    text: `-${data.value.toFixed(1)} sec`,
                    x: data.pos.x,
                    y: data.pos.y
                }
            ]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== id));
            }, 500);
        });

        return () => {
            unsubscribeGain();
            unsubscribeDrain();
        }
    }, []);

  return (
    <div className="floating-layer">
      {floatingTexts.map(t => (
            <p 
                key={t.id} 
                className="floating-text"
                style={{
                    left: t.x,
                    top: t.y
                }}
            >
                {t.text}
            </p>
        ))}
    </div>
  )
}
