import React from 'react';
import { GAME_CONFIG } from '../../../config/gameConfig';

export interface DeckStackProps {
  tier: 1 | 2 | 3;
  deckCount: number;
  onClick?: (tier: 1 | 2 | 3) => void;
}

// Tier-specific icons (SVG paths)
const TIER_ICONS = {
  1: (
    /* Dagger/Basic Gear motif */
    <path d="M50 10 L60 40 L85 45 L60 55 L50 85 L40 55 L15 45 L40 40 Z" fill="none" stroke="currentColor" strokeWidth="2" />
  ),
  2: (
    /* Arcane/Rune motif */
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="50" cy="50" r="35" strokeDasharray="4 2" />
      <path d="M50 15 L55 35 L75 35 L60 50 L70 70 L50 60 L30 70 L40 50 L25 35 L45 35 Z" />
    </g>
  ),
  3: (
    /* Absolute/Elder Brain/Crown motif */
    <g fill="none" stroke="currentColor" strokeWidth="2">
       <path d="M20 70 Q50 20 80 70 M20 70 Q50 90 80 70" />
       <circle cx="50" cy="50" r="10" />
       <path d="M30 40 L50 10 L70 40 M20 50 L10 30 M80 50 L90 30" />
    </g>
  )
};

const TIER_CONFIG = {
  1: {
    bg: 'bg-[#2a1b15]', // Leather brown
    border: 'border-[#8b5a2b]', // Bronze
    sealBg: 'bg-[#5c2a18]', // Deep red
    iconColor: 'text-[#8b5a2b]/30',
    shadow: 'shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(139,90,43,0.2)]',
    label: 'I'
  },
  2: {
    bg: 'bg-[#151b2a]', // Midnight blue
    border: 'border-[#71797e]', // Silver
    sealBg: 'bg-[#182a5c]', // Royal blue
    iconColor: 'text-[#71797e]/30',
    shadow: 'shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(113,121,126,0.2)]',
    label: 'II'
  },
  3: {
    bg: 'bg-[#1b152a]', // Royal purple
    border: 'border-[var(--color-gold-dark)]', // Gold
    sealBg: 'bg-[#3e185c]', // Imperial purple
    iconColor: 'text-[var(--color-gold-dark)]/30',
    shadow: 'shadow-[0_10px_30px_rgba(191,149,63,0.3),inset_0_0_20px_rgba(191,149,63,0.1)]',
    label: 'III'
  }
};

export const DeckStack: React.FC<DeckStackProps> = ({ tier, deckCount, onClick }) => {
  const config = TIER_CONFIG[tier];

  return (
    <div className="relative group w-full aspect-[2/3]" onClick={() => onClick?.(tier)}>
      {/* Visual Stack Layers (Behind) */}
      <div className={`absolute inset-0 translate-x-1 translate-y-1 rounded-md ${config.bg} border ${config.border} opacity-40`}></div>
      <div className={`absolute inset-0 translate-x-2 translate-y-2 rounded-md ${config.bg} border ${config.border} opacity-20`}></div>

      <div 
        className={`w-full h-full rounded-md relative overflow-hidden transition-all duration-300 border-2 ${config.border} ${config.bg} ${config.shadow} group-hover:-translate-y-2 group-hover:-translate-x-1 cursor-pointer z-10`}
        role="button" 
        aria-label={`Deck tier ${tier}, count ${deckCount}`}
      >
        {/* Decorative corners */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${config.border} opacity-50`}></div>
        <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${config.border} opacity-50`}></div>
        <div className={`absolute bottom-0 left-0 w-4 h-4 border-b border-l ${config.border} opacity-50`}></div>
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${config.border} opacity-50`}></div>

        {/* Background Motif */}
        <div className={`absolute inset-0 flex items-center justify-center ${config.iconColor} p-8 pointer-events-none transition-transform group-hover:scale-110 duration-500`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {TIER_ICONS[tier]}
          </svg>
        </div>

        {/* 3D Wax Seal with Count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`relative rounded-full ${config.sealBg} shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_8px_16px_rgba(0,0,0,0.6)] border-2 border-black/30 flex flex-col items-center justify-center transform transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}
            style={{ width: GAME_CONFIG.UI.DECK_SEAL_SIZE, height: GAME_CONFIG.UI.DECK_SEAL_SIZE }}
          >
            {/* Melted wax edges effect */}
            <div className={`absolute -inset-1 rounded-full ${config.sealBg} opacity-40 blur-[2px] -z-10 animate-pulse`}></div>
            
            <span className="font-serif text-[28px] font-black text-[#ffd700] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {deckCount}
            </span>
            <span className="font-fantasy text-[12px] text-[#ffd700]/80 uppercase tracking-tighter font-bold leading-none mt-1">
              {config.label}
            </span>
          </div>
        </div>

        {/* Overlay Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none mix-blend-overlay"></div>
      </div>
    </div>
  );
};
