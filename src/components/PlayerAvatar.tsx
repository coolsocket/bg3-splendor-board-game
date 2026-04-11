import React from 'react';
import './PlayerAvatar.css';
import galeImg from '../assets/gale_portrait.png';
import astarionImg from '../assets/astarion_portrait.png';
import { PrestigeBadge } from './PrestigeBadge';

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
      <div className="flex items-center">
        <div className="player-avatar-container">
          {avatarImg ? (
            <img src={avatarImg} alt={playerName} className="player-avatar-img" />
          ) : (
            <div className="player-avatar-img bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
              {playerName.charAt(0)}
            </div>
          )}
          <PrestigeBadge prestigePoints={prestigePoints} />
        </div>
        <h2 className="player-name text-base font-bold text-white flex items-center">
          <span>{playerName}</span>
          {isActive && <span className="hourglass ml-2 text-amber-400" aria-label="Active turn">⏳</span>}
        </h2>
      </div>
    </div>
  );
};
