import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStateStore } from '../../store/gameStateStore';
import { AssetRepository } from '../../repositories/assetRepository';
import { type Player } from '../../domain/models';
import { PrestigeBadge } from '../PrestigeBadge';
import { ZH, EN } from '../../data/translations';
import { useAudioStore } from '../../store/audioStore';

interface VictoryVFXProps {
  winners: Player[];
  onReset: () => void;
}

const ASCENSION_THEMES = [
  {
    assetId: 'jergal',
    quoteEN: '"Fate spins along as it should... Thou hast ascended."',
    quoteZH: '"命运的车轮依旧转动... 你已飞升。"',
    color: 'text-gold',
    glow: 'shadow-[0_0_50px_rgba(212,175,55,0.6)]'
  },
  {
    assetId: 'the_absolute',
    quoteEN: '"IN MY NAME."',
    quoteZH: '"以吾之名。"',
    color: 'text-purple-400',
    glow: 'shadow-[0_0_50px_rgba(168,85,247,0.6)]'
  },
  {
    assetId: 'bhaal',
    quoteEN: '"Blood. Blood. Blood!"',
    quoteZH: '"血。血。血！"',
    color: 'text-red-600',
    glow: 'shadow-[0_0_50px_rgba(220,38,38,0.6)]'
  }
];

export const VictoryVFX: React.FC<VictoryVFXProps> = ({ winners, onReset }) => {
  const language = useGameStateStore(state => state.language);
  const t = language === 'ZH' ? ZH : EN;
  
  const [theme] = useState(() => ASCENSION_THEMES[Math.floor(Math.random() * ASCENSION_THEMES.length)]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const bgImage = AssetRepository.getArt(theme.assetId);

  useEffect(() => {
    useAudioStore.getState().playAudio('victory_ascension');
    const timer = setTimeout(() => {
      setShowLeaderboard(true);
    }, 3000); // Show leaderboard after 3 seconds of cinematic
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[3000] bg-black overflow-hidden flex flex-col items-center justify-center font-fantasy">
      {/* Cinematic Background */}
      <motion.div 
        className="absolute inset-0 opacity-60 mix-blend-screen"
        initial={{ scale: 1, opacity: 0, filter: 'blur(8px)' }}
        animate={{ scale: 1.03, opacity: 0.5, filter: 'blur(0px)' }}
        transition={{ duration: 15, ease: "easeOut" }}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Heavy Vignette & Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_80%)] pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80 pointer-events-none z-[2]" />

      {/* Cinematic Quote */}
      <AnimatePresence>
        {!showLeaderboard && (
          <motion.div 
            className="relative z-10 text-center px-8 w-full max-w-5xl flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 1.02, filter: 'blur(5px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 
              className={`text-4xl md:text-5xl lg:text-7xl font-black ${theme.color} tracking-widest leading-tight`}
              style={{ textShadow: '0 5px 15px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.8), 0 0 20px currentColor' }}
            >
              {language === 'ZH' ? theme.quoteZH : theme.quoteEN}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div 
            className="relative z-20 flex flex-col items-center gap-8 w-full max-w-2xl px-6"
            initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h2 
              className={`text-5xl md:text-6xl font-black tracking-widest uppercase ${theme.color} drop-shadow-[0_0_20px_currentColor]`}
              style={{ textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}
            >
              {t.victory || 'Ascension'}
            </h2>

            <div className={`w-full bg-[#0a0a0f]/80 backdrop-blur-xl border border-ui-border-tier1/50 p-8 rounded-2xl ${theme.glow} flex flex-col gap-5 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />
              
              {winners.map((winner, idx) => (
                <motion.div 
                  key={winner.id} 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + idx * 0.3, type: "spring", stiffness: 100 }}
                  className={`flex items-center justify-between p-5 rounded-xl border relative z-10 transition-transform hover:scale-105 ${idx === 0 ? 'bg-gradient-to-r from-gold/20 to-transparent border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 border-white/10'}`}
                >
                  <div className="flex items-center gap-6">
                     <span className={`text-4xl font-black italic drop-shadow-md ${idx === 0 ? 'text-gold' : 'text-gray-500'}`}>#{idx + 1}</span>
                     <span className="text-3xl font-fantasy text-ui-text-parchment drop-shadow-lg" style={{ color: idx === 0 ? '#f5e6c4' : '#dccbb0' }}>{winner.name}</span>
                  </div>
                  <div className="flex items-center gap-3 scale-125 origin-right">
                     <PrestigeBadge prestigePoints={winner.prestigePoints} size="lg" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, type: "spring" }}
              onClick={() => onReset()}
              className={`mt-6 px-12 py-5 border-2 border-white/20 bg-black/50 backdrop-blur-sm text-white font-black text-xl tracking-[0.3em] uppercase rounded-lg cursor-pointer pointer-events-auto hover:bg-white/10 hover:border-white/60 hover:scale-105 transition-all duration-300 ${theme.glow}`}
            >
              {t.playAgain || 'Start Anew'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
