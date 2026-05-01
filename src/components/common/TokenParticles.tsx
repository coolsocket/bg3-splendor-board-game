/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { type ResourceType } from '../TokenTypes';
import { UnifiedToken } from './UnifiedToken';

interface Particle {
  id: number;
  type: ResourceType;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const TokenParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleSpawn = (e: CustomEvent<{ type: ResourceType; x: number; y: number }>) => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 6; i++) {
        newParticles.push({
          id: Math.random(),
          type: e.detail.type,
          x: e.detail.x,
          y: e.detail.y,
          vx: Math.random() * 5 + 1, // bias towards the right (player board)
          vy: -Math.random() * 7 - 5, // upward thrust
        });
      }
      setParticles(prev => [...prev, ...newParticles]);
    };

    window.addEventListener('spawn-particles' as any, handleSpawn);
    return () => window.removeEventListener('spawn-particles' as any, handleSpawn);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const frame = requestAnimationFrame(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.4, // gravity
          }))
          .filter(p => p.y < window.innerHeight + 50) // Remove when off screen
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-6 h-6"
          style={{
            transform: `translate(${p.x}px, ${p.y}px)`,
          }}
        >
          <UnifiedToken type={p.type} size="sm" />
        </div>
      ))}
    </div>
  );
};

export const spawnTokenParticles = (type: ResourceType, x: number, y: number) => {
  const event = new CustomEvent('spawn-particles', {
    detail: { type, x, y },
  });
  window.dispatchEvent(event);
};
