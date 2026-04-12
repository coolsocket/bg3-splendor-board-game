import React from 'react';

interface PrestigeBadgeProps {
  prestigePoints: number;
}

export const PrestigeBadge: React.FC<PrestigeBadgeProps> = ({ prestigePoints }) => {
  return (
    <div 
      className="absolute top-1 right-1 w-[22px] h-[26px] bg-[linear-gradient(135deg,#bf953f_0%,#fcf6ba_25%,#b38728_50%,#fbf5b7_75%,#aa771c_100%)] border border-[#5c4418] rounded-t-[2px] rounded-b-[10px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-[var(--z-interactive)]"
    >
      <span className="font-serif text-[0.8rem] font-bold text-[#1a1c23] text-shadow-[0_1px_0_rgba(255,255,255,0.5)]">{prestigePoints}</span>
    </div>
  );
};
