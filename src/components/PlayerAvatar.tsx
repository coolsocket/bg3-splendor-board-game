import React from 'react';
import { Avatar } from './common/Avatar';
import { AssetRepository } from '../repositories/assetRepository';

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
    <div className={`flex items-center justify-between w-full border-b border-[#bf953f] mb-2 ${isActive ? 'bg-gradient-to-r from-[#1a1710]/80 to-transparent rounded-sm py-1 px-2' : 'pb-2'}`}>
      <div className="flex items-center min-w-0">
        <Avatar
          imageUrl={avatarImg || undefined}
          name={playerName}
          size="lg"
          isActive={isActive}
          prestigePoints={prestigePoints}
          showPrestigeShield={true}
          className="mr-3"
        />
        <h2 className="text-base font-bold text-[#E8E2D2] flex items-center min-w-0 text-shadow-[1px_1px_3px_rgba(0,0,0,0.9),0_0_5px_rgba(255,255,255,0.4)]">
          <span className="truncate">{playerName}</span>
          {isActive && <span className="inline-block animate-[spin_2s_linear_infinite] ml-2 text-amber-400" aria-label="Active turn">⏳</span>}
        </h2>
      </div>
    </div>
  );
};
