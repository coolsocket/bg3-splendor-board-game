import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

export interface PrestigeBadgeProps {
  prestigePoints: number | undefined;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const PrestigeBadge: React.FC<PrestigeBadgeProps> = ({ prestigePoints, className = '', size = 'md' }) => {
  if (prestigePoints === undefined) return null;

  const sizeConfig = {
    xs: {
      text: 'text-[0.8rem] mt-[0px]'
    },
    sm: {
      text: 'text-[1.1rem] mt-[1px]'
    },
    md: {
      text: 'text-[1.4rem] mt-[2px]'
    },
    lg: {
      text: 'text-[1.8rem] mt-[2px]'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;
  const pixelSize = GAME_CONFIG.UI.PRESTIGE_BADGE_SIZES[size];

  return (
    <div 
      className={`rounded-full bg-gradient-to-br from-[#ffd700] via-[var(--color-gold)] to-[#b8860b] border-[2px] border-[#ffeb73] shadow-[0_2px_8px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center ${className.includes('z-') ? '' : 'z-[20]'} ${className}`}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      title={`${prestigePoints} Prestige Points`}
    >
      <span className={`font-fantasy font-bold text-[#452b14] leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] ${config.text}`}>
        {prestigePoints}
      </span>
    </div>
  );
};
