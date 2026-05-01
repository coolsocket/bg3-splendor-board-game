/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PatronSlot } from '../PatronSlot';
import type { Patron } from '../../domain/models';
import { ANIMATION_COLORS } from './animationConfig';

interface PatronFlightInstance {
  id: number;
  patron: Patron;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const PatronFlight: React.FC = () => {
  const [flights, setFlights] = useState<PatronFlightInstance[]>([]);

  useEffect(() => {
    const handleSpawn = (e: CustomEvent<{ patron: Patron; startX: number; startY: number; endX: number; endY: number }>) => {
      const newFlight: PatronFlightInstance = {
        id: Math.random(),
        patron: e.detail.patron,
        startX: e.detail.startX,
        startY: e.detail.startY,
        endX: e.detail.endX,
        endY: e.detail.endY,
      };
      setFlights(prev => [...prev, newFlight]);

      // Force cleanup
      setTimeout(() => {
        setFlights(prev => prev.filter(f => f.id !== newFlight.id));
      }, 3000);
    };

    window.addEventListener('spawn-patron-flight' as any, handleSpawn);
    return () => window.removeEventListener('spawn-patron-flight' as any, handleSpawn);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      <AnimatePresence>
        {flights.map(f => {
          // Center of the screen control points for dramatic effect
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2 - 100;

          return (
            <motion.div
              key={f.id}
              className="absolute"
              initial={{ x: f.startX, y: f.startY, scale: 0.9, opacity: 1 }}
              animate={{ 
                x: [f.startX, centerX, f.endX],
                y: [f.startY, centerY, f.endY],
                scale: [0.9, 2.5, 0.4],
                rotateY: [0, 360, 0],
                opacity: [1, 1, 0],
                filter: [
                  'drop-shadow(0 0 0px rgba(0,0,0,0))', 
                  `drop-shadow(0 0 50px ${ANIMATION_COLORS.buyGlow}) brightness(1.5)`, 
                  'drop-shadow(0 0 0px rgba(0,0,0,0))'
                ]
              }}
              transition={{
                duration: 2.0,
                times: [0, 0.4, 1], // Spends 40% time getting to center, then flies to target
                ease: "easeInOut",
              }}
              onAnimationComplete={() => {
                window.dispatchEvent(new CustomEvent('screen-shake-minor'));
                setFlights(prev => prev.filter(flight => flight.id !== f.id));
              }}
            >
              <div className="w-24">
                <PatronSlot patron={f.patron} />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

import { broadcastAnimationEvent } from '../../store/gameStateStore';

export const spawnPatronFlight = (patron: Patron, startX: number, startY: number, endX: number, endY: number, fromNetwork?: boolean) => {
  const detail = { patron, startX, startY, endX, endY, fromNetwork };
  const event = new CustomEvent('spawn-patron-flight', { detail });
  window.dispatchEvent(event);
  if (!fromNetwork) {
    broadcastAnimationEvent('spawn-patron-flight', detail);
  }
};