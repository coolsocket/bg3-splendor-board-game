/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { type ResourceType } from '../TokenTypes';
import { motion, AnimatePresence } from 'framer-motion';

import { ANIMATION_COLORS } from './animationConfig';

interface TransferEvent {
  id: string;
  tokens: Partial<Record<ResourceType, number>>;
  startX: number;
  startY: number;
  targetSelector?: string;
  targetX?: number;
  targetY?: number;
}



interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type?: ResourceType;
  wobble?: number;
}

interface TrailPoint {
  x: number;
  y: number;
}

interface Trail {
  points: TrailPoint[];
  color: string;
  isFading?: boolean;
}

interface Impact {
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
}

// Global Canvas for high-performance particle trails, beams, and impacts
const ParticleCanvas: React.FC<{ 
  particlesRef: React.MutableRefObject<Particle[]>,
  trailsRef: React.MutableRefObject<Record<string, Trail>>,
  impactsRef: React.MutableRefObject<Impact[]>
}> = ({ particlesRef, trailsRef, impactsRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw impacts (shockwaves)
      const impacts = impactsRef.current;
      ctx.globalCompositeOperation = 'screen';
      for (let i = impacts.length - 1; i >= 0; i--) {
        const imp = impacts[i];
        imp.life--;
        if (imp.life <= 0) {
          impacts.splice(i, 1);
          continue;
        }

        const progress = 1 - (imp.life / imp.maxLife);
        const opacity = Math.pow(1 - progress, 2);
        
        // Ring shockwave
        ctx.beginPath();
        ctx.arc(imp.x, imp.y, progress * 120, 0, Math.PI * 2);
        ctx.lineWidth = 6 * opacity;
        ctx.strokeStyle = imp.color;
        ctx.globalAlpha = opacity * 0.8;
        ctx.stroke();

        // Secondary ring
        ctx.beginPath();
        ctx.arc(imp.x, imp.y, progress * 60, 0, Math.PI * 2);
        ctx.lineWidth = 2 * opacity;
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = opacity * 0.5;
        ctx.stroke();

        // Inner glow
        ctx.beginPath();
        ctx.arc(imp.x, imp.y, progress * 80, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(imp.x, imp.y, 0, imp.x, imp.y, progress * 80);
        grad.addColorStop(0, imp.color);
        grad.addColorStop(0.5, imp.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalAlpha = opacity * 0.4;
        ctx.fill();
      }

      // 2. Draw trails (Beams of light)
      const trails = trailsRef.current;
      ctx.globalCompositeOperation = 'screen';
      for (const id in trails) {
        const trail = trails[id];
        const points = trail.points;

        if (trail.isFading && points.length > 0) {
          // Retract the tail smoothly
          for(let k=0; k<4; k++) points.shift();
        }

        if (points.length < 2) {
          delete trailsRef.current[id];
          continue;
        }

        for (let i = 1; i < points.length; i++) {
          const progress = i / points.length;
          
          // Outer Glow (Comet Tail)
          ctx.beginPath();
          ctx.moveTo(points[i-1].x, points[i-1].y);
          ctx.lineTo(points[i].x, points[i].y);
          ctx.strokeStyle = trail.color;
          ctx.lineCap = 'round';
          ctx.lineWidth = 40 * Math.pow(progress, 2); // Exponential tapering
          ctx.globalAlpha = progress * 0.5;
          ctx.stroke();

          // Inner Bright Core
          ctx.beginPath();
          ctx.moveTo(points[i-1].x, points[i-1].y);
          ctx.lineTo(points[i].x, points[i].y);
          ctx.strokeStyle = '#ffffff';
          ctx.lineCap = 'round';
          ctx.lineWidth = 6 * progress;
          ctx.globalAlpha = progress * 0.9;
          ctx.stroke();
        }
      }

      // 3. Draw particles
      const particles = particlesRef.current;
      if (particles.length > 0) {
        ctx.globalCompositeOperation = 'screen';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life--;
          
          // Elemental Physics
          if (p.type === 'INFERNAL_IRON') {
            p.vy -= 0.1; // Smoke floats up
            p.vx += (Math.random() - 0.5) * 0.5;
            ctx.globalCompositeOperation = 'source-over'; // Smoke is opaque
          } else if (p.type === 'NATURES_BLESSING') {
            p.wobble = (p.wobble || 0) + 0.1;
            p.x += Math.sin(p.wobble) * 2; // Leaf flutter
            p.vy += 0.05; // Gentle fall
          } else if (p.type === 'ARCANE_CRYSTAL') {
            p.vy += 0.2; // Gravity for shards
            ctx.globalCompositeOperation = 'screen';
          } else {
            ctx.globalCompositeOperation = 'screen';
          }

          p.x += p.vx;
          p.y += p.vy;
          
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          const progress = p.life / p.maxLife;

          if (p.type === 'ARCANE_CRYSTAL') {
             // Draw angular shard
             ctx.beginPath();
             ctx.moveTo(p.x, p.y - p.size);
             ctx.lineTo(p.x + p.size/2, p.y + p.size/2);
             ctx.lineTo(p.x - p.size/2, p.y + p.size/2);
             ctx.closePath();
             ctx.fillStyle = p.color;
             ctx.globalAlpha = progress;
             ctx.fill();
          } else if (p.type === 'NATURES_BLESSING') {
             // Draw leaf shape
             ctx.beginPath();
             ctx.ellipse(p.x, p.y, p.size, p.size / 2, p.wobble || 0, 0, Math.PI * 2);
             ctx.fillStyle = p.color;
             ctx.globalAlpha = progress;
             ctx.fill();
          } else {
            // Draw default / ember round particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * progress);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(0.4, p.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = progress;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [particlesRef, trailsRef, impactsRef]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998]" />;
};

interface FlyingCoinProps {
  id: string;
  type: ResourceType;
  startX: number;
  startY: number;
  targetSelector?: string;
  targetX?: number;
  targetY?: number;
  delay: number;
  onComplete: (x: number, y: number) => void;
  emitParticle: (x: number, y: number, color: string, type: ResourceType, vx?: number, vy?: number) => void;
  updateTrail: (id: string, x: number, y: number, color: string) => void;
}

const FlyingCoin: React.FC<FlyingCoinProps> = ({ 
  id, type, startX, startY, targetSelector, targetX, targetY, delay, onComplete, emitParticle, updateTrail
}) => {
  const [targetPos, setTargetPos] = useState({ x: targetX ?? startX, y: targetY ?? startY });
  const prevPos = useRef({ x: startX, y: startY });
  const color = ANIMATION_COLORS.resources[type];

  useEffect(() => {
    const updatePos = () => {
      if (targetX !== undefined && targetY !== undefined) {
        setTargetPos({
          x: targetX + (Math.random() - 0.5) * 40,
          y: targetY + (Math.random() - 0.5) * 40
        });
      } else if (targetSelector) {
        const el = document.querySelector(targetSelector);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetPos({ 
            x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
            y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 40 
          });
        }
      }
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    return () => window.removeEventListener('resize', updatePos);
  }, [targetSelector, targetX, targetY]);

  // Physical bouncy path variables
  const [controlPoint] = useState(() => ({
    x: startX + (Math.random() - 0.5) * 400,
    y: Math.min(startY, targetPos.y) - 200 - Math.random() * 200
  }));

  const bounceOffset = React.useMemo(() => (Math.random() - 0.5) * 15, []);

  return (
    <motion.div
      className="absolute z-[10000]"
      initial={{ x: startX, y: startY, opacity: 0, scale: 0.5 }}
      animate={{ 
        x: [startX, controlPoint.x, targetPos.x, targetPos.x + bounceOffset, targetPos.x],
        y: [startY, controlPoint.y, targetPos.y, targetPos.y - 40, targetPos.y],
        opacity: [0, 1, 1, 1, 1],
        scale: [0.5, 1.5, 1, 1.3, 1]
      }}
      transition={{
        duration: 0.8,
        times: [0, 0.4, 0.7, 0.85, 1], // The bounce happens between 0.7 and 1.0
        ease: "easeInOut",
        delay: delay,
      }}
      onUpdate={(latest) => {
        if (typeof latest.x === 'number' && typeof latest.y === 'number') {
          const vx = latest.x - prevPos.current.x;
          const vy = latest.y - prevPos.current.y;
          prevPos.current = { x: latest.x, y: latest.y };

          updateTrail(id, latest.x, latest.y, color);
          if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
            emitParticle(latest.x, latest.y, color, type, -vx * 0.3, -vy * 0.3);
          }
        }
      }}
      onAnimationComplete={() => onComplete(targetPos.x, targetPos.y)}
    >
      <div className="-translate-x-1/2 -translate-y-1/2 rounded-full"
           style={{ 
             width: '12px',
             height: '12px',
             background: '#ffffff',
             boxShadow: `0 0 20px 10px ${color}, 0 0 40px 20px ${color}`
           }}
      />
    </motion.div>
  );
};

export const TokenTransfer: React.FC = () => {
  const [transfers, setTransfers] = useState<TransferEvent[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Record<string, Trail>>({});
  const impactsRef = useRef<Impact[]>([]);

  useEffect(() => {
    const handleStart = (e: CustomEvent<TransferEvent>) => {
      const newTransfer = e.detail;
      setTransfers(prev => [...prev, newTransfer]);

      // Forcefully remove after 2.5 seconds to prevent stuck tokens
      setTimeout(() => {
        setTransfers(prev => prev.filter(t => t.id !== newTransfer.id));
        // Also clean up any stuck trails for this transfer immediately
        Object.keys(trailsRef.current).forEach(key => {
          if (key.startsWith(newTransfer.id)) {
             delete trailsRef.current[key];
          }
        });
      }, 2500);
    };
    window.addEventListener('start-token-transfer' as any, handleStart);
    return () => window.removeEventListener('start-token-transfer' as any, handleStart);
  }, []);

  const emitParticle = useCallback((x: number, y: number, color: string, type: ResourceType, vx: number = 0, vy: number = 0) => {
    for (let i = 0; i < 1; i++) {
      let particleColor = color;
      if (type === 'INFERNAL_IRON' && Math.random() > 0.6) {
        particleColor = '#444444'; // Emit some dark smoke for infernal iron
      }
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: vx + (Math.random() - 0.5) * 3,
        vy: vy + (Math.random() - 0.5) * 3,
        life: 60 + Math.random() * 40,
        maxLife: 100, 
        color: particleColor,
        size: type === 'NATURES_BLESSING' ? Math.random() * 5 + 3 : Math.random() * 3 + 1,
        type: type,
        wobble: Math.random() * Math.PI * 2
      });
    }
  }, []);

  const updateTrail = useCallback((id: string, x: number, y: number, color: string) => {
    if (!trailsRef.current[id]) {
      trailsRef.current[id] = { points: [], color };
    }
    if (trailsRef.current[id].isFading) return;
    trailsRef.current[id].points.push({ x, y });
    if (trailsRef.current[id].points.length > 20) {
      trailsRef.current[id].points.shift();
    }
  }, []);

  const emitImpact = useCallback((x: number, y: number, color: string, type: ResourceType) => {
    impactsRef.current.push({ x, y, color, life: 40, maxLife: 40 });
    // Add extra "burst" particles on impact matching elemental theme
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color,
        size: Math.random() * 5 + 2,
        type: type,
        wobble: Math.random() * Math.PI * 2
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <ParticleCanvas particlesRef={particlesRef} trailsRef={trailsRef} impactsRef={impactsRef} />
      <AnimatePresence>
        {transfers.flatMap(t => {
          const particleList: ResourceType[] = [];
          Object.entries(t.tokens).forEach(([type, count]) => {
            const normalizedType = type.toUpperCase() as ResourceType;
            for (let i = 0; i < (count || 0); i++) {
              particleList.push(normalizedType);
            }
          });

          return particleList.map((type, i) => (
            <FlyingCoin
              key={`${t.id}-${i}`}
              id={`${t.id}-${i}`}
              type={type}
              startX={t.startX}
              startY={t.startY}
              targetSelector={t.targetSelector}
              targetX={t.targetX}
              targetY={t.targetY}
              delay={i * 0.075}
              emitParticle={emitParticle}
              updateTrail={updateTrail}
              onComplete={(x, y) => {
                emitImpact(x, y, ANIMATION_COLORS.resources[type], type);
                window.dispatchEvent(new CustomEvent('token-impact'));
                
                if (trailsRef.current[`${t.id}-${i}`]) {
                  trailsRef.current[`${t.id}-${i}`].isFading = true;
                }
                
                // When a coin finishes, delay and then check if we can remove the transfer
                setTimeout(() => {
                  setTransfers(prev => prev.filter(trans => trans.id !== t.id));
                  delete trailsRef.current[`${t.id}-${i}`];
                }, 800);
              }}
            />
          ));
        })}
      </AnimatePresence>
    </div>
  );
};

import { broadcastAnimationEvent } from '../../store/gameStateStore';

export const triggerTokenTransfer = (event: Omit<TransferEvent, 'id'> & { fromNetwork?: boolean }) => {
  const id = Math.random().toString(36).substring(2, 9);
  const detail = { id, ...event };
  const e = new CustomEvent('start-token-transfer', { detail });
  window.dispatchEvent(e);
  if (!event.fromNetwork) {
    broadcastAnimationEvent('start-token-transfer', detail);
  }
};
