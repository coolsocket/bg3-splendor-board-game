import React from 'react';
import './PrestigeBadge.css';

interface PrestigeBadgeProps {
  prestigePoints: number;
}

export const PrestigeBadge: React.FC<PrestigeBadgeProps> = ({ prestigePoints }) => {
  return (
    <div className="prestige-badge-shield">
      <span className="prestige-points">{prestigePoints}</span>
    </div>
  );
};
