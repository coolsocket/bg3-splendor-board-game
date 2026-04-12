import React from 'react';
import { type ResourceType } from '../Token';

interface ResourceIconProps {
  type: ResourceType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const resourceIcons: Record<ResourceType, string> = {
  RADIANT_GEM: '☀️',
  ARCANE_CRYSTAL: '🔮',
  NATURES_BLESSING: '🍃',
  INFERNAL_IRON: '🔥',
  DARK_QUARTZ: '🌑',
  TRUE_SOUL_TADPOLE: '⭐'
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
      className={`resource-icon ${sizeClasses[size]} ${className}`}
      title={type.replace('_', ' ')}
    >
      {icon}
    </span>
  );
});
