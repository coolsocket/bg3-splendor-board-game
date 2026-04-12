import React from 'react';
import './PlayerAvatar.css';
import { Avatar } from './common/Avatar';
import { AssetRepository } from '../repositories/AssetRepository';

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
    <div className={`player-board-header flex items-center justify-between w-full ${isActive ? 'active-header' : ''}`}>
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
        <h2 className="player-name text-base font-bold text-white flex items-center min-w-0">
          <span className="truncate">{playerName}</span>
          {isActive && <span className="hourglass ml-2 text-amber-400" aria-label="Active turn">⏳</span>}
        </h2>
      </div>
    </div>
  );
};
