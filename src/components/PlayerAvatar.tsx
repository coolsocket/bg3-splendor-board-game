import React from 'react';
import './PlayerAvatar.css';
import galeImg from '../assets/gale_portrait.png';
import astarionImg from '../assets/astarion_portrait.png';

interface PlayerAvatarProps {
  playerName: string;
  isActive?: boolean;
  prestigePoints: number;
}

const getAvatarImg = (name: string) => {
  if (name === 'Gale') return galeImg;
  if (name === 'Astarion') return astarionImg;
  return null;
};

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  playerName,
  isActive = false,
  prestigePoints
}) => {
  const avatarImg = getAvatarImg(playerName);
  return (
    <div className={`player-board-header flex items-center justify-between w-full ${isActive ? 'active-header' : ''}`}>
      <h2 className="player-name text-base font-bold text-white flex items-center">
        {avatarImg && (
          <img src={avatarImg} alt={playerName} className="player-avatar-img" />
        )}
        <span>{playerName}</span>
        <span className="prestige-score text-amber-400 ml-2">({prestigePoints} VP)</span>
        {isActive && <span className="hourglass ml-2 text-amber-400" aria-label="Active turn">⏳</span>}
      </h2>
    </div>
  );
};
