import React from 'react';
import './PlayerAvatar.css';
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
  return (
    <div className="player-board-header">
      <h2 className="player-name">
        {playerName}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isActive && <span className="hourglass" aria-label="Active turn">⏳</span>}
        <PrestigeBadge prestigePoints={prestigePoints} />
      </div>
    </div>
  );
};
