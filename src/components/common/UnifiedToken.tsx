/**
 * @module: Visual Atomic Unit
 * @component: UnifiedToken
 * @material: cost-xxx, --color-gold
 * @purity: Pure UI
 */
import React from 'react';
import type { ResourceType } from '../TokenTypes';
import { getDisplayName } from '../TokenTypes';

// Import assets
import infernalIronImg from '../../assets/tokens/infernal_iron.png';
import radiantGemImg from '../../assets/tokens/radiant_gem.png';
import arcaneCrystalImg from '../../assets/tokens/arcane_crystal.png';
import naturesBlessingImg from '../../assets/tokens/natures_blessing.png';
import darkQuartzImg from '../../assets/tokens/dark_quartz.png';
import tadpoleImg from '../../assets/tokens/tadpole.png';

import { useGameStateStore } from '../../store/gameStateStore';
import { ZH, EN } from '../../data/translations';
import { GAME_CONFIG } from '../../config/gameConfig';

export interface UnifiedTokenProps {
  type: ResourceType;
  amount?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
  disableBlend?: boolean;
}

const resourceImages: Record<ResourceType, string> = {
  INFERNAL_IRON: infernalIronImg,
  RADIANT_GEM: radiantGemImg,
  ARCANE_CRYSTAL: arcaneCrystalImg,
  NATURES_BLESSING: naturesBlessingImg,
  DARK_QUARTZ: darkQuartzImg,
  TRUE_SOUL_TADPOLE: tadpoleImg,
};

const resourceGradients: Record<ResourceType, string> = {
  'RADIANT_GEM': "cost-radiant_gem",
  'ARCANE_CRYSTAL': "cost-arcane_crystal",
  'NATURES_BLESSING': "cost-natures_blessing",
  'INFERNAL_IRON': "cost-infernal_iron",
  'DARK_QUARTZ': "cost-dark_quartz",
  'TRUE_SOUL_TADPOLE': "cost-true_soul_tadpole"
};

export const UnifiedToken: React.FC<UnifiedTokenProps> = ({
  type,
  amount,
  size = 'md',
  interactive = false,
  onClick,
  className = '',
  disabled = false,
  disableBlend = false,
}) => {
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;

  const resourceKey = type.toLowerCase();
  const displayName = (t as any)[resourceKey] || getDisplayName(type);

  const isActionable = interactive && !disabled && onClick;
  const imageUrl = resourceImages[type];
  const gradientClass = resourceGradients[type];
  
  // Use config-driven sizes. For 'xs', we fallback to a small fixed value since it's not in config yet.
  const pixelSize = (GAME_CONFIG.UI.TOKEN_SIZES as any)[size] || (size === 'xs' ? 16 : 40);

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        rounded-full
        ${isActionable ? 'cursor-pointer hover:scale-110 transition-transform duration-200' : ''}
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'opacity-100'}
        ${gradientClass}
        border border-gold/70
        shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)]
        ${className}
      `}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      onClick={isActionable ? onClick : undefined}
      title={`${displayName}${amount !== undefined ? `: ${amount}` : ''}`}
      role={isActionable ? 'button' : 'img'}
      aria-label={`${displayName}${amount !== undefined ? ` count ${amount}` : ''}`}
    >
      {/* Asset Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={displayName} 
          className={`w-full h-full object-cover rounded-full ${disableBlend ? '' : 'mix-blend-multiply'}`} 
        />
      )}
      
      {/* Amount at bottom-right (outside) */}
      {amount !== undefined && amount > 0 && (
        <span className={`
          absolute -bottom-1 -right-1
          text-white font-bold font-fantasy
          ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}
          drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]
          z-20
        `}>
          {amount}
        </span>
      )}
    </div>
  );
};
