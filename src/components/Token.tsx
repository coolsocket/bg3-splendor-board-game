import React from 'react';
import './Token.css';

export type ResourceType =
  | 'RADIANT_GEM'
  | 'ARCANE_CRYSTAL'
  | 'NATURES_BLESSING'
  | 'INFERNAL_IRON'
  | 'DARK_QUARTZ'
  | 'TRUE_SOUL_TADPOLE';

interface TokenProps {
  type: ResourceType;
  count: number;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export const Token: React.FC<TokenProps> = ({ type, count, onClick, disabled = false, isSelected = false }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const getLabel = (type: ResourceType) => {
    switch (type) {
      case 'RADIANT_GEM': return 'RG';
      case 'ARCANE_CRYSTAL': return 'AC';
      case 'NATURES_BLESSING': return 'NB';
      case 'INFERNAL_IRON': return 'II';
      case 'DARK_QUARTZ': return 'DQ';
      case 'TRUE_SOUL_TADPOLE': return 'TT';
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
        className={`token ${type.toLowerCase()} ${disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`} 
        onClick={handleClick}
        role="button"
        aria-label={`${type} token, count: ${count}`}
      >
        <div className="token-inner">
          {type === 'TRUE_SOUL_TADPOLE' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="token-wildcard-icon">
              <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z"/>
            </svg>
          )}
          <span className="token-count">{count}</span>
        </div>
      </div>
      {isAnimating && (
        <div 
          className={`token flying ${type.toLowerCase()}`} 
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
