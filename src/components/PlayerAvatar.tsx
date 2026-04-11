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
      <div className="flex items-center min-w-0">
        <div className="player-avatar-container">
          {avatarImg ? (
            <img src={avatarImg} alt={playerName} className="player-avatar-img" />
          ) : (
            <div className="player-avatar-img bg-gray-700 flex items-center justify-center">
              <svg className="avatar-placeholder-icon" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
          )}
          <div className="prestige-crest">
            <span>{prestigePoints}</span>
          </div>
        </div>
        <h2 className="player-name text-base font-bold text-white flex items-center min-w-0">
          <span className="truncate">{playerName}</span>
          {isActive && <span className="hourglass ml-2 text-amber-400" aria-label="Active turn">⏳</span>}
        </h2>
      </div>
    </div>
  );
};
