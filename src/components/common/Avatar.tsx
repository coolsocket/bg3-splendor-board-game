import React from 'react';
import { PrestigeBadge } from '../PrestigeBadge';

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
  
  prestigePoints,
  showPrestigeShield = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className={`rounded-full overflow-hidden flex items-center justify-center w-full h-full bg-[var(--color-bg-obsidian,#1a1a1a)]`}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center bg-gray-700 w-full h-full">
            {size === 'sm' ? (
              <span className="font-serif text-white font-bold">{name.charAt(0)}</span>
            ) : (
              <svg className="w-3/5 h-3/5 fill-gray-400" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
        )}
      </div>
      {showPrestigeShield && prestigePoints !== undefined && prestigePoints > 0 && (
        <PrestigeBadge 
          prestigePoints={prestigePoints} 
          size="md"
          className="absolute top-[-8px] left-[-8px]" 
        />
      )}
    </div>
  );
};
