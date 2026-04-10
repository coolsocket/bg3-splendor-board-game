import React from 'react';
import './PrestigeBadge.css';

interface PrestigeBadgeProps {
  prestigePoints: number;
}

export const PrestigeBadge: React.FC<PrestigeBadgeProps> = ({ prestigePoints }) => {
  return (
    <div className="prestige-badge">
      <span className="prestige-label">Prestige</span>
      <span className="prestige-value">{prestigePoints}</span>
    </div>
  );
};
