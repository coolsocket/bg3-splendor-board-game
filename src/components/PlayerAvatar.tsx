import React from 'react';
import './PlayerAvatar.css';

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
  return (
    <div className={`player-board-header flex items-center justify-between w-full ${isActive ? 'active-header' : ''}`}>
      <h2 className="player-name text-base font-bold text-white flex items-center">
        <span>{playerName}</span>
        <span className="prestige-score text-amber-400 ml-2">({prestigePoints} VP)</span>
        {isActive && <span className="hourglass ml-2 text-amber-400" aria-label="Active turn">⏳</span>}
      </h2>
    </div>
  );
};
