import React from 'react';
import type { ResourceType } from '../TokenTypes';

interface ResourceIconProps {
  type: ResourceType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const resourceIcons: Record<ResourceType, React.ReactNode> = {
  RADIANT_GEM: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
    </svg>
  ),
  ARCANE_CRYSTAL: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 2l8 10-8 10-8-10z" />
    </svg>
  ),
  NATURES_BLESSING: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 2C8 2 5 5 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-4-3-7-7-7zm-2 8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4-2c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
    </svg>
  ),
  INFERNAL_IRON: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M20 4H4v4l4 4-4 4v4h16v-4l-4-4 4-4V4zm-2 12v2H6v-2l4-4-4-4V6h12v2l-4 4 4 4z" />
    </svg>
  ),
  DARK_QUARTZ: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 2l9 5v10l-9 5-9-5V7z" />
    </svg>
  ),
  TRUE_SOUL_TADPOLE: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 2C8 2 5 5 5 9C5 12.5 7.5 14.5 9 15C8.5 16.5 7.5 18.5 6 20C8.5 19.5 10.5 17.5 11 16C11.5 18 11.5 20 11.5 22C12 22 12.5 22 12.5 22C12.5 20 12.5 18 13 16C13.5 17.5 15.5 19.5 18 20C16.5 18.5 15.5 16.5 15 15C16.5 14.5 19 12.5 19 9C19 5 16 2 12 2Z" />
    </svg>
  )
};

const resourceColors: Record<ResourceType, string> = {
  RADIANT_GEM: '#FFFDD0', // Cream/Radiant
  ARCANE_CRYSTAL: '#00BFFF', // Deep Sky Blue
  NATURES_BLESSING: '#32CD32', // Lime Green
  INFERNAL_IRON: '#FF4500', // Orange Red
  DARK_QUARTZ: '#DA70D6', // Orchid/Purple
  TRUE_SOUL_TADPOLE: '#FFD700' // Gold
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
      style={{ color: resourceColors[type] }}
    >
      {icon}
    </span>
  );
});
