import React from 'react';
import './Token.css';
import { type ResourceType, getDisplayName } from './TokenTypes';

interface TokenProps {
  type: ResourceType;
  count: number;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'consumable' | 'permanent';
  hideLabel?: boolean;
}

export const Token = React.memo(({ type, count, onClick, disabled = false, isSelected = false, size = 'md', variant = 'consumable', hideLabel = false }: TokenProps) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const getLabel = (type: ResourceType) => {
    switch (type) {
      case 'RADIANT_GEM': return 'FG';
      case 'ARCANE_CRYSTAL': return 'EA';
      case 'NATURES_BLESSING': return 'PB';
      case 'INFERNAL_IRON': return 'SC';
      case 'DARK_QUARTZ': return 'P';
      case 'TRUE_SOUL_TADPOLE': return 'AP';
      default: return '';
    }
  };

  const handleClick = () => {
    if (onClick && !disabled) {
      setIsAnimating(true);
      onClick();
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <>
      <div 
        className={`token ${type.toLowerCase()} ${disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} token-${size} token-${variant}`} 
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`${getDisplayName(type)} token, count: ${count}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        <div className="token-inner">
          {type === 'TRUE_SOUL_TADPOLE' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="token-wildcard-icon">
              <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" />
              <path d="M12 2 L12 22" />
              <path d="M4 7 L20 17" />
              <path d="M4 17 L20 7" />
            </svg>
          ) : (
            !hideLabel && <span className="token-label">{getLabel(type)}</span>
          )}
          <span className="token-count">{count}</span>
        </div>
      </div>
      {isAnimating && (
        <div 
          className={`token flying ${type.toLowerCase()} token-${size} token-${variant}`} 
          onAnimationEnd={handleAnimationEnd}
          data-testid={`flying-token-${type}`}
        >
          <div className="token-inner">
          </div>
        </div>
      )}
    </>
  );
});
