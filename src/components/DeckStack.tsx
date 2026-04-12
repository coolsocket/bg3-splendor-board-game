import React from 'react';

export interface DeckStackProps {
  tier: 1 | 2 | 3;
  deckCount: number;
}

const cardBackSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='none' stroke='rgba(139, 115, 85, 0.2)' stroke-width='1'/><circle cx='50' cy='50' r='35' fill='none' stroke='rgba(139, 115, 85, 0.1)' stroke-width='0.5'/><polygon points='50,5 90,75 10,75' fill='none' stroke='rgba(139, 115, 85, 0.15)' stroke-width='0.5'/><polygon points='50,95 90,25 10,25' fill='none' stroke='rgba(139, 115, 85, 0.15)' stroke-width='0.5'/></svg>";

export const DeckStack: React.FC<DeckStackProps> = ({ tier, deckCount }) => {
  return (
    <div 
      className={`w-full aspect-[2/3] rounded-md relative overflow-hidden transition-transform duration-300 border-2 border-[var(--color-tier-${tier})] shadow-[2px_2px_0_#1c0d02,3px_3px_0_#b58a3e,5px_5px_0_#1c0d02,6px_6px_0_#b58a3e,8px_8px_0_#1c0d02,9px_9px_0_#b58a3e,11px_11px_15px_rgba(0,0,0,0.6)] hover:-translate-y-1 cursor-pointer`}
      role="button" 
      aria-label={`Deck tier ${tier}, count ${deckCount}`}
    >
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-card-back-bg)',
          backgroundImage: `url("${cardBackSvg}"), linear-gradient(to bottom, var(--color-card-back-gradient-start), var(--color-card-back-bg))`,
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: 'center, center',
          backgroundSize: '80%, cover'
        }}
      >
        <div className="w-[70px] h-[70px] rounded-full bg-[#8b0000] bg-[radial-gradient(circle_at_30%_30%,#b22222,#7a0000_70%)] border border-white/20 shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(0,0,0,0.8),0_5px_10px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center">
          <span className="font-serif text-2xl font-bold text-[#ffd700] leading-none text-shadow-[-1px_-1px_0_rgba(0,0,0,0.8),1px_1px_0_rgba(255,255,255,0.3),0_0_4px_rgba(0,0,0,0.5)]">{deckCount}</span>
          <span className="font-serif text-lg text-[#ffd700] uppercase tracking-wider font-bold leading-none text-shadow-[-0.5px_-0.5px_0_rgba(0,0,0,0.8),0.5px_0.5px_0_rgba(255,255,255,0.3)]">{tier === 1 ? 'I' : tier === 2 ? 'II' : 'III'}</span>
        </div>
      </div>
    </div>
  );
};
