import React, { useState, useEffect } from 'react';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

export const MouseClickIndicator: React.FC = () => {
  const [clicks, setClicks] = useState<ClickEffect[]>([]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Only left mouse click (button === 0) on desktop/laptop screens (min-width 1024px)
      if (e.button === 0 && window.innerWidth >= 1024) {
        const newClick: ClickEffect = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
        };
        setClicks((prev) => [...prev, newClick]);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const removeClick = (id: number) => {
    setClicks((prev) => prev.filter((c) => c.id !== id));
  };

  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden lg:block">
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-ping-fade"
          style={{
            left: `${click.x}px`,
            top: `${click.y}px`,
            animation: 'clickFadeOut 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          onAnimationEnd={() => removeClick(click.id)}
        >
          {/* Neon Green Circular Ring */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#00ff66] shadow-[0_0_12px_#00ff66]" />
          {/* Glowing Center Dot */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
        </div>
      ))}
      <style>{`
        @keyframes clickFadeOut {
          0% {
            transform: translate(-50%, -50%) scale(0.4);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
