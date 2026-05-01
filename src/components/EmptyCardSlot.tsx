import React from 'react';
import { useGameStateStore } from '../store/gameStateStore';
import { ZH, EN } from '../data/translations';

const cardBackSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='none' stroke='rgba(212, 175, 55, 0.3)' stroke-width='1'/><circle cx='50' cy='50' r='35' fill='none' stroke='rgba(212, 175, 55, 0.2)' stroke-width='0.5'/><polygon points='50,5 90,75 10,75' fill='none' stroke='rgba(212, 175, 55, 0.25)' stroke-width='0.5'/><polygon points='50,95 90,25 10,25' fill='none' stroke='rgba(212, 175, 55, 0.25)' stroke-width='0.5'/></svg>";

export const EmptyCardSlot: React.FC = () => {
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;

  return (
    <div 
      className="w-full aspect-[2/3] border-2 border-dashed border-[var(--color-gold-dark)]/30 rounded-md flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-card-back-bg)',
        backgroundImage: `linear-gradient(to bottom, var(--color-card-back-gradient-start), var(--color-card-back-bg))`,
      }}
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: `url("${cardBackSvg}")`,
          backgroundSize: 'contain'
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--color-gold-dark)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--color-gold-dark)" strokeWidth="2" strokeDasharray="5,5" />
      </svg>
      <span className="font-fantasy text-sm text-[var(--color-gold-dark)]/50 uppercase tracking-wider font-bold z-10 bg-[#1a1a1a]/80 px-2 py-1 rounded">{t.emptySlot}</span>
    </div>
  );
};
