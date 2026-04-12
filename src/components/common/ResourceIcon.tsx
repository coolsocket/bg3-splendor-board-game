import React from 'react';
import type { ResourceType } from '../TokenTypes';

interface ResourceIconProps {
  type: ResourceType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const resourceIcons: Record<ResourceType, React.ReactNode> = {
  RADIANT_GEM: '❂',
  ARCANE_CRYSTAL: '✦',
  NATURES_BLESSING: '❦',
  INFERNAL_IRON: '▲',
  DARK_QUARTZ: '◆',
  TRUE_SOUL_TADPOLE: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 2C8 2 5 5 5 9C5 12.5 7.5 14.5 9 15C8.5 16.5 7.5 18.5 6 20C8.5 19.5 10.5 17.5 11 16C11.5 18 11.5 20 11.5 22C12 22 12.5 22 12.5 22C12.5 20 12.5 18 13 16C13.5 17.5 15.5 19.5 18 20C16.5 18.5 15.5 16.5 15 15C16.5 14.5 19 12.5 19 9C19 5 16 2 12 2Z" />
    </svg>
  )
};

export const ResourceIcon = React.memo(({
  type,
  size = 'md',
  className = ''
}: ResourceIconProps) => {
  const icon = resourceIcons[type] || '❓'; // Fallback to question mark
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <span 
      className={`resource-icon inline-flex items-center justify-center aspect-square shrink-0 ${sizeClasses[size]} ${className}`}
      title={type.replace('_', ' ')}
    >
      {icon}
    </span>
  );
});
