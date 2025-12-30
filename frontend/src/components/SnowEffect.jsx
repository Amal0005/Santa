import React, { useEffect, useState } from 'react';

const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            animationDuration: Math.random() * 3 + 2 + 's',
            opacity: Math.random(),
            size: Math.random() * 10 + 5 + 'px'
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {snowflakes.map(flake => (
                <div
                    key={flake.id}
                    className="absolute text-white"
                    style={{
                        left: flake.left,
                        top: -20,
                        fontSize: flake.size,
                        opacity: flake.opacity,
                        animation: `fall ${flake.animationDuration} linear infinite`
                    }}
                >
                    ❄
                </div>
            ))}
            <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
};

export default SnowEffect;
