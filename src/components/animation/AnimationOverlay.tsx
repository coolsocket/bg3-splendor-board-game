import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingCoin {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

export const AnimationOverlay: React.FC = () => {
  const [coins, setCoins] = useState<FlyingCoin[]>([]);

  useEffect(() => {
    const handleTriggerAnimation = (e: CustomEvent) => {
      const { startX, startY, endX, endY, color } = e.detail;
      const newCoin: FlyingCoin = {
        id: Math.random().toString(36).substring(2, 9),
        startX,
        startY,
        endX,
        endY,
        color,
      };
      setCoins((prev) => [...prev, newCoin]);
    };

    window.addEventListener('trigger-coin-animation' as any, handleTriggerAnimation);

    return () => {
      window.removeEventListener('trigger-coin-animation' as any, handleTriggerAnimation);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {coins.map((coin) => (
          <motion.div
            key={coin.id}
            initial={{ x: coin.startX, y: coin.startY, scale: 1, opacity: 1 }}
            animate={{ 
              x: coin.endX, 
              y: coin.endY, 
              scale: 0.6,
              opacity: 0.8,
              transition: { 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1.0] // Cubic bezier for smooth trajectory
              }
            }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setCoins((prev) => prev.filter((c) => c.id !== coin.id));
            }}
            className="absolute w-8 h-8 rounded-full border border-amber-700/50 shadow-lg flex items-center justify-center"
            style={{ 
              backgroundColor: coin.color,
              boxShadow: `0 0 15px ${coin.color}`,
              transform: 'translate(-50%, -50%)' // Center on coordinates
            }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-transparent to-black/40 flex items-center justify-center">
              <span className="text-xs font-bold text-white/90">$</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
