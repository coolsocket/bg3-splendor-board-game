import React from 'react';
import { HeroAvatar } from './common/HeroAvatar';
import { AssetRepository } from '../repositories/assetRepository';
import { PrestigeBadge } from './PrestigeBadge';

interface PlayerAvatarProps {
  playerName: string;
  isActive?: boolean;
  prestigePoints: number;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  playerName,
  isActive = false,
  prestigePoints
}) => {
  const avatarImg = AssetRepository.getAvatar(playerName);
  return (
    <div className={`flex items-center justify-between w-full border-b border-[var(--color-gold-dark)] mb-2 ${isActive ? 'bg-gradient-to-r from-[#1a1710]/80 to-transparent rounded-sm py-1 px-2' : 'pb-2'}`}>
      <div className="flex items-center min-w-0">
        <div className="relative mr-3 w-24 h-24 flex-shrink-0">
          <HeroAvatar
            imageUrl={avatarImg || undefined}
            name={playerName}
            className="w-full h-full rounded-full"
          />
          {prestigePoints > 0 && (
            <PrestigeBadge 
              prestigePoints={prestigePoints} 
              size="md"
              className="absolute -top-2 -left-2 z-20" 
            />
          )}
        </div>
        <h2 
          className="text-[clamp(0.8rem,1.5vw,1.2rem)] font-bold flex items-center min-w-0 w-full"
          style={{ color: '#FFFFFF', textShadow: '1px 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(255,255,255,0.6)' }}
        >  <span className="block text-ellipsis overflow-hidden whitespace-nowrap" title={playerName}>{playerName}</span>
        </h2>
      </div>
    </div>
  );
};
