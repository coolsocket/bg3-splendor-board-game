import React from 'react';
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
  className?: string;
}

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

const getTokenClasses = (
  type: ResourceType,
  size: 'sm' | 'md' | 'lg',
  variant: 'consumable' | 'permanent',
  disabled: boolean,
  isSelected: boolean,
  className: string
) => {
  const baseClasses = "token w-full aspect-square shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 relative select-none box-border border-2 border-black/30";
  
  const sizeClasses = {
    sm: "max-w-[40px]",
    md: "max-w-[60px]",
    lg: "max-w-[80px]"
  }[size];

  const variantClasses = variant === 'permanent' 
    ? "!rounded-none rotate-45 hover:-translate-y-0.5 hover:rotate-45" 
    : "hover:-translate-y-0.5 hover:brightness-110";

  const disabledClasses = disabled ? "cursor-not-allowed opacity-50 grayscale brightness-[70%]" : "";
  
  const selectedClasses = isSelected ? "shadow-[0_0_0_4px_var(--color-wildcard-mid),0_4px_6px_-1px_rgba(0,0,0,0.5)]" : "";

  const hoverClasses = disabled ? "" : "hover:scale-105";

  // Gem specific classes (gradients, shapes, pseudo-elements)
  let gemClasses = "";
  switch (type) {
    case 'RADIANT_GEM':
      gemClasses = "bg-[conic-gradient(from_45deg,var(--color-radiant-dark),var(--color-radiant-mid)_25%,var(--color-radiant-light)_50%,var(--color-radiant-mid)_75%,var(--color-radiant-dark))] shadow-[var(--shadow-depth)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5),0_0_15px_var(--color-radiant)]";
      break;
    case 'ARCANE_CRYSTAL':
      gemClasses = "bg-[conic-gradient(from_45deg,var(--color-arcane-dark),var(--color-arcane-mid)_25%,var(--color-arcane-light)_50%,var(--color-arcane-mid)_75%,var(--color-arcane-dark))] shadow-[var(--shadow-depth)] hover:shadow-[var(--glow-arcane)]";
      break;
    case 'NATURES_BLESSING':
      gemClasses = "bg-[conic-gradient(from_45deg,var(--color-natures-dark),var(--color-natures-mid)_25%,var(--color-natures-light)_50%,var(--color-natures-mid)_75%,var(--color-natures-dark))] shadow-[var(--shadow-depth)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5),0_0_15px_var(--color-natures)] before:content-[''] before:absolute before:top-[-6px] before:left-1/2 before:-translate-x-1/2 before:w-[14px] before:h-[8px] before:bg-[var(--color-natures-mid)] before:rounded-t-sm before:border-2 before:border-black/30 before:border-b-0 before:z-[var(--z-above)]";
      break;
    case 'INFERNAL_IRON':
      gemClasses = "bg-[conic-gradient(from_45deg,var(--color-infernal-dark),var(--color-infernal-mid)_25%,var(--color-infernal-light)_50%,var(--color-infernal-mid)_75%,var(--color-infernal-dark))] shadow-[var(--shadow-depth),inset_0_0_10px_var(--color-infernal)] border-2 border-[var(--color-infernal-mid)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5),0_0_15px_var(--color-infernal)] before:content-[''] before:absolute before:top-[4px] before:left-[4px] before:right-[4px] before:bottom-[4px] before:border before:border-dashed before:border-[var(--color-infernal)] before:rounded-full before:opacity-60 before:pointer-events-none";
      break;
    case 'DARK_QUARTZ':
      gemClasses = "bg-[conic-gradient(from_45deg,var(--color-dark-dark),var(--color-dark-mid)_25%,var(--color-dark-light)_50%,var(--color-dark-mid)_75%,var(--color-dark-dark))] shadow-[var(--shadow-depth)] !rounded-[70%_30%_30%_70%_/_60%_40%_60%_40%] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5),0_0_15px_var(--color-dark)]";
      break;
    case 'TRUE_SOUL_TADPOLE':
      gemClasses = "bg-[conic-gradient(from_45deg,var(--color-wildcard-dark),var(--color-wildcard-mid)_25%,var(--color-wildcard-light)_50%,var(--color-wildcard-mid)_75%,var(--color-wildcard-dark))] shadow-[0_0_25px_rgba(255,215,0,0.9),0_4px_6px_-1px_rgba(0,0,0,0.5)] border-2 border-[var(--color-wildcard-mid)] !rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.8),0_10px_15px_-3px_rgba(0,0,0,0.5)]";
      break;
  }

  // Glossy overlay (after element)
  const glossyOverlay = "after:content-[''] after:absolute after:top-[2px] after:left-1/2 after:-translate-x-1/2 after:w-[70%] after:h-[25%] after:bg-gradient-to-b after:from-white/50 after:to-white/5 after:rounded-full after:pointer-events-none";

  return `${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${selectedClasses} ${gemClasses} ${glossyOverlay} ${hoverClasses} ${className}`;
};

export const Token = React.memo(({ type, count, onClick, disabled = false, isSelected = false, size = 'md', variant = 'consumable', hideLabel = false, className = '' }: TokenProps) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClick = () => {
    if (onClick && !disabled) {
      setIsAnimating(true);
      onClick();
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  const tokenClasses = getTokenClasses(type, size, variant, disabled, isSelected, className);

  const innerClasses = `w-full h-full rounded-full flex items-center justify-center font-fantasy text-parchment text-shadow-[0_2px_4px_rgba(0,0,0,0.8)] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.6),inset_0_2px_6px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.6)] ${variant === 'permanent' ? '!rounded-none -rotate-45' : ''} ${type === 'DARK_QUARTZ' ? '!rounded-[70%_30%_30%_70%_/_60%_40%_60%_40%]' : ''}`;

  const countClasses = `text-[20px] font-bold relative z-[var(--z-interactive)] text-shadow-[-1px_-1px_0px_rgba(0,0,0,0.8),1px_1px_0px_rgba(255,255,255,0.15)] 
    ${(type === 'RADIANT_GEM' || type === 'NATURES_BLESSING') ? 'text-[var(--color-pure-black)]' : ''}
    ${type === 'TRUE_SOUL_TADPOLE' ? 'bg-[#0a0a0f]/85 rounded-[8px] px-1.5 py-0.5 shadow-[0_0_5px_rgba(0,0,0,0.5)]' : ''}`;

  return (
    <>
      <div 
        className={tokenClasses} 
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
        <div className={innerClasses}>
          {type === 'TRUE_SOUL_TADPOLE' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 color-[rgba(212,175,55,0.3)] pointer-events-none">
              <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" />
              <path d="M12 2 L12 22" />
              <path d="M4 7 L20 17" />
              <path d="M4 17 L20 7" />
            </svg>
          ) : (
            !hideLabel && <span className="text-[10px] font-bold opacity-80 tracking-wider">{getLabel(type)}</span>
          )}
          <span className={countClasses}>{count}</span>
        </div>
      </div>
      {isAnimating && (
        <div 
          className={`${tokenClasses} absolute top-0 left-0 pointer-events-none z-[var(--z-dropdown)] animate-fly-to-player`} 
          onAnimationEnd={handleAnimationEnd}
          data-testid={`flying-token-${type}`}
        >
          <div className={innerClasses}>
          </div>
        </div>
      )}
    </>
  );
});
