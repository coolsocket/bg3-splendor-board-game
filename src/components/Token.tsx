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
}

export const Token: React.FC<TokenProps> = ({ type, count, onClick, disabled = false }) => {
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
        className={`token ${type.toLowerCase()} ${disabled ? 'disabled' : ''}`} 
        onClick={handleClick}
        role="button"
        aria-label={`${type} token, count: ${count}`}
      >
        <div className="token-inner">
          <span className="token-label">{getLabel(type)}</span>
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
            <span className="token-label">{getLabel(type)}</span>
          </div>
        </div>
      )}
    </>
  );
};
