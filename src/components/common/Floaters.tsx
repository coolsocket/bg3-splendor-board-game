import React, { useEffect } from 'react';
import { useFloaterStore } from '../../store/floaterStore';

export const FloaterOverlay: React.FC = () => {
  const { floaters, removeFloater } = useFloaterStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {floaters.map((floater) => (
        <FloaterItem
          key={floater.id}
          floater={floater}
          onComplete={() => removeFloater(floater.id)}
        />
      ))}
    </div>
  );
};

const FloaterItem: React.FC<{
  floater: { id: string; text: string; x: number; y: number; color: string };
  onComplete: () => void;
}> = ({ floater, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute font-fantasy font-bold text-2xl animate-float-up"
      style={{
        left: `${floater.x}px`,
        top: `${floater.y}px`,
        color: floater.color,
        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
      }}
    >
      {floater.text}
    </div>
  );
};
