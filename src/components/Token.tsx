import React from 'react';
import './Token.css';

export type ResourceType =
  | 'RADIANT_GEM'
  | 'ARCANE_CRYSTAL'
  | 'NATURES_BLESSING'
  | 'INFERNAL_IRON'
  | 'DARK_QUARTZ'
  | 'TRUE_SOUL_TADPOLE';

export const getDisplayName = (type: ResourceType) => {
  switch (type) {
    case 'RADIANT_GEM': return 'Fairy Gold';
    case 'ARCANE_CRYSTAL': return 'Enchanted Agate';
    case 'NATURES_BLESSING': return 'Necrotic Bone Coin';
    case 'INFERNAL_IRON': return 'Soul Coin';
    case 'DARK_QUARTZ': return 'Mind Flayer Specimen';
    case 'TRUE_SOUL_TADPOLE': return 'Astral Prism';
    default: return type;
  }
};

interface TokenProps {
  type: ResourceType;
  count: number;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'consumable' | 'permanent';
}

export const Token: React.FC<TokenProps> = ({ type, count, onClick, disabled = false, isSelected = false, size = 'md', variant = 'consumable' }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const getLabel = (type: ResourceType) => {
    switch (type) {
      case 'RADIANT_GEM': return 'FG';
      case 'ARCANE_CRYSTAL': return 'EA';
      case 'NATURES_BLESSING': return 'BC';
      case 'INFERNAL_IRON': return 'SC';
      case 'DARK_QUARTZ': return 'MS';
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
        aria-label={`${getDisplayName(type)} token, count: ${count}`}
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
            <span className="token-label">{getLabel(type)}</span>
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
};
