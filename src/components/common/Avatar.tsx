import React from 'react';
import './Avatar.css';

export interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  prestigePoints?: number;
  showPrestigeShield?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 'md',
  isActive = false,
  prestigePoints,
  showPrestigeShield = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg'
  };

  return (
    <div className={`avatar-wrapper ${sizeClasses[size]} ${isActive ? 'avatar-active' : ''} ${className}`}>
      <div className="avatar-container">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="avatar-img" />
        ) : (
          <div className="avatar-placeholder flex items-center justify-center bg-gray-700 w-full h-full">
            {size === 'sm' ? (
              <span className="avatar-letter text-white font-bold">{name.charAt(0)}</span>
            ) : (
              <svg className="avatar-placeholder-icon w-3/5 h-3/5 fill-gray-400" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
        )}
      </div>
      {showPrestigeShield && prestigePoints !== undefined && (
        <div className="avatar-prestige-crest">
          <span>{prestigePoints}</span>
        </div>
      )}
    </div>
  );
};
