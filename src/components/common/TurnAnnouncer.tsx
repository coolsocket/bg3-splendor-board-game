import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStateStore } from '../../store/gameStateStore';
import { GamePhase } from '../../domain/models';
import { ZH, EN } from '../../data/translations';

interface Announcement {
  text: string;
  type: 'start' | 'end' | 'phase';
  id: string;
}

export const TurnAnnouncer: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;
  const phase = useGameStateStore((state) => state.phase);

  const [particles] = useState(() => 
    [...Array(12)].map(() => ({
      xStart: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      scale: Math.random() * 2,
      xTarget: (Math.random() - 0.5) * 200 + (Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800)),
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2
    }))
  );

  useEffect(() => {
    const handleAnnounce = (e: any) => {
      if (useGameStateStore.getState().phase === GamePhase.COMPLETED) return;
      setAnnouncement({
        ...e.detail,
        id: Math.random().toString(36).substring(7)
      });
      
      setTimeout(() => {
        setAnnouncement(null);
      }, 2500); // Reduced to 2.5s per user request
    };

    window.addEventListener('announce-turn', handleAnnounce);
    return () => window.removeEventListener('announce-turn', handleAnnounce);
  }, []);

  // Monitor phase changes for specific announcements
  useEffect(() => {
    if (phase === GamePhase.COMPLETED) {
      const timer = setTimeout(() => setAnnouncement(null), 0);
      return () => clearTimeout(timer);
    }
    if (phase === GamePhase.LAST_ROUND) {
      const timer = setTimeout(() => {
        setAnnouncement({
          text: language === 'ZH' ? '最后一轮！' : 'LAST ROUND!',
          type: 'phase',
          id: 'last-round-announce'
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [phase, language]);

  if (phase === GamePhase.COMPLETED) return null;

  return (
    <AnimatePresence mode="wait">
      {announcement && (
        <motion.div
          key={announcement.id}
          data-testid="epic-announcer"
          className="fixed inset-0 flex flex-col items-center justify-center z-[9999] pointer-events-none"
        >
          {/* Full Screen Cinematic Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)'
            }}
          />

          {/* Epic Reveal Ribbons (Horizontal Bars) */}
          <div className="relative w-full h-[180px] flex items-center justify-center overflow-hidden">
             {/* Top Gold Ribbon */}
             <motion.div 
               initial={{ y: 0, scaleX: 0 }}
               animate={{ y: -90, scaleX: 1 }}
               exit={{ y: 0, scaleX: 0 }}
               transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
               className="absolute w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_15px_rgba(212,175,55,1)]"
             />
             
             {/* Bottom Gold Ribbon */}
             <motion.div 
               initial={{ y: 0, scaleX: 0 }}
               animate={{ y: 90, scaleX: 1 }}
               exit={{ y: 0, scaleX: 0 }}
               transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
               className="absolute w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_15px_rgba(212,175,55,1)]"
             />

             {/* The Text Content */}
             <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, letterSpacing: '0.5em', filter: 'blur(10px)' }}
                  animate={{ opacity: 1, letterSpacing: '0.15em', filter: 'blur(0px)' }}
                  exit={{ opacity: 0, letterSpacing: '0.8em', filter: 'blur(20px)' }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  className="text-6xl md:text-8xl font-fantasy text-parchment drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] relative"
                >
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-[var(--color-parchment)] via-[var(--color-gold)] to-[#8a6d3b]">
                    {announcement.text}
                  </span>
                  {/* Subtle Light Sweep Overlay */}
                  <div className="absolute inset-0 text-sweep opacity-30 z-20 pointer-events-none select-none">
                    {announcement.text}
                  </div>
                </motion.div>

                {/* Subtitle / Decorative flare */}
                <motion.div
                   initial={{ opacity: 0, scaleX: 0 }}
                   animate={{ opacity: 0.6, scaleX: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 1, delay: 0.6 }}
                   className="mt-4 px-20 py-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent text-[var(--color-parchment)] font-bold text-xs uppercase tracking-[0.5em]"
                >
                   {announcement.type === 'start' ? t.initiativeGained : t.phaseShift}
                </motion.div>
             </div>

              {/* Embers/Particles Overlay */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 {particles.map((p, i) => (
                   <motion.div
                     key={i}
                     className="absolute w-1 h-1 bg-gold/60 rounded-full"
                     initial={{ 
                       x: p.xStart, 
                       y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
                       opacity: 0,
                       scale: p.scale
                     }}
                     animate={{ 
                       y: [typeof window !== 'undefined' ? window.innerHeight / 2 : 300, -100],
                       x: p.xTarget,
                       opacity: [0, 0.8, 0],
                     }}
                     transition={{ 
                       duration: p.duration,
                       repeat: Infinity,
                       delay: p.delay
                     }}
                   />
                 ))}
              </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
