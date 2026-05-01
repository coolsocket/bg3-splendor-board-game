/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { type Card as DomainCard } from '../../domain/models';
import { Card } from '../features/market/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_COLORS, PHYSICS_CONFIG } from './animationConfig';

interface FlightInstance {
  id: number;
  card: DomainCard;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  animationClass?: string;
}

export const CardFlight: React.FC = () => {
  const [flights, setFlights] = useState<FlightInstance[]>([]);

  useEffect(() => {
    const handleSpawn = (e: CustomEvent<{ card: DomainCard; x: number; y: number; endX?: number; endY?: number; animationClass?: string }>) => {
      const newFlight: FlightInstance = {
        id: Math.random(),
        card: e.detail.card,
        startX: e.detail.x,
        startY: e.detail.y,
        endX: e.detail.endX,
        endY: e.detail.endY,
        animationClass: e.detail.animationClass,
      };
      setFlights(prev => [...prev, newFlight]);

      setTimeout(() => {
        setFlights(prev => prev.filter(f => f.id !== newFlight.id));
      }, PHYSICS_CONFIG.flight.cleanupDelay);
    };

    window.addEventListener('spawn-card-flight' as any, handleSpawn);
    return () => window.removeEventListener('spawn-card-flight' as any, handleSpawn);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {flights.map(f => {
          const isReserve = f.animationClass?.includes('reserve');
          const isBuy = f.animationClass?.includes('buy') || f.animationClass?.includes('searing-slam');
          
          let animationConfig = {};
          let transitionConfig = {};

          if (isReserve) {
            const hangX = f.startX + (window.innerWidth / 2 - f.startX) * 0.4; 
            const hangY = Math.min(f.startY, f.endY ?? 150) - 150;
            animationConfig = {
              x: [f.startX, hangX, f.endX ?? 50],
              y: [f.startY, hangY, f.endY ?? 150],
              scale: [1, 1.6, 0.35],
              rotateZ: [0, 15, -5],
              rotateY: [0, 180, 360],
              opacity: [1, 1, 0],
            };
            transitionConfig = { duration: 1.2, times: [0, 0.6, 1], ease: ["circOut", "circIn"] };
          } else if (isBuy) {
            animationConfig = {
              x: [f.startX, f.startX, f.endX ?? 50],
              y: [f.startY, f.startY - 40, f.endY ?? 150],
              scale: [1, 1.15, 0.3],
              rotateZ: [0, 5, 0],
              opacity: [1, 1, 0],
            };
            transitionConfig = { duration: 0.8, times: [0, 0.15, 1], ease: [0.175, 0.885, 0.32, 1.275] };
          } else {
            animationConfig = {
              x: [f.startX, f.startX + ((f.endX || 50) - f.startX) * 0.3, f.endX ?? 50],
              y: [f.startY, f.startY + ((f.endY || 150) - f.startY) * 0.2 - 150, f.endY ?? 150],
              scale: [1, 1.2, 0.3],
              rotateZ: [0, 15, 0],
              opacity: [1, 1, 0],
            };
            transitionConfig = { duration: 1.2, times: [0, 0.3, 1], ease: [0.34, 1.56, 0.64, 1] };
          }

          return (
            <motion.div
              key={f.id}
              className="absolute w-[120px]"
              initial={{ x: f.startX, y: f.startY, scale: 1, opacity: 1 }}
              animate={animationConfig}
              transition={transitionConfig}
            >
              <div className="relative">
                {isReserve && (
                  <div className="absolute inset-0 flex items-center justify-center z-50">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 animate-spin-slow" style={{ filter: `drop-shadow(0 0 10px ${ANIMATION_COLORS.magicCircle.glow})` }}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke={ANIMATION_COLORS.magicCircle.outer} strokeWidth="2" strokeDasharray="5 5" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke={ANIMATION_COLORS.magicCircle.inner} strokeWidth="1" />
                    </svg>
                  </div>
                )}
                <Card 
                  id={f.card.id}
                  assetId={f.card.assetId || ""}
                  name={f.card.name}
                  tier={f.card.tier as 1 | 2 | 3}
                  prestigePoints={f.card.points}
                  providedBonus={f.card.bonus.toUpperCase() as any}
                  description={f.card.description}
                  cost={Object.entries(f.card.cost).reduce((acc, [type, amount]) => {
                    acc[type.toUpperCase() as any] = amount;
                    return acc;
                  }, {} as any)}
                  isAffordable={true}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

import { broadcastAnimationEvent } from '../../store/gameStateStore';

export const spawnCardFlight = (card: DomainCard, x: number, y: number, endX?: number, endY?: number, animationClass?: string, fromNetwork?: boolean) => {
  const detail = { card, x, y, endX, endY, animationClass, fromNetwork };
  const event = new CustomEvent('spawn-card-flight', { detail });
  window.dispatchEvent(event);
  if (!fromNetwork) broadcastAnimationEvent('spawn-card-flight', detail);
};
