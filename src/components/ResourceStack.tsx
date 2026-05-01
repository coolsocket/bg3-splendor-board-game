import React from 'react';
import { type ResourceType, getDisplayName } from './TokenTypes';
import { UnifiedToken } from './common/UnifiedToken';
import { type CardProps } from './features/market/Card';
import { useGameStateStore } from '../store/gameStateStore';
import { ZH, EN } from '../data/translations';
import { AssetRepository } from '../repositories/assetRepository';

interface ResourceStackProps {
  tokens: Record<ResourceType, number>;
  ownedCards: CardProps[];
  interactive?: boolean;
  onTokenClick?: (type: ResourceType) => void;
}

const ORDERED_RESOURCES: ResourceType[] = [
  'RADIANT_GEM',
  'ARCANE_CRYSTAL',
  'NATURES_BLESSING',
  'INFERNAL_IRON',
  'DARK_QUARTZ',
  'TRUE_SOUL_TADPOLE'
];

const TYPE_COLORS: Record<ResourceType, { start: string, end: string }> = {
  RADIANT_GEM: { start: 'var(--color-radiant-mid)', end: 'var(--color-radiant-dark)' },
  ARCANE_CRYSTAL: { start: 'var(--color-arcane-mid)', end: 'var(--color-arcane-dark)' },
  NATURES_BLESSING: { start: 'var(--color-natures-mid)', end: 'var(--color-natures-dark)' },
  INFERNAL_IRON: { start: 'var(--color-infernal)', end: 'var(--color-infernal-mid)' },
  DARK_QUARTZ: { start: 'var(--color-dark-mid)', end: 'var(--color-dark-dark)' },
  TRUE_SOUL_TADPOLE: { start: 'var(--color-wildcard-pink-mid)', end: 'var(--color-wildcard-pink-dark)' }
};

export const ResourceStack: React.FC<ResourceStackProps> = ({ tokens, ownedCards, interactive, onTokenClick }) => {
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;

  return (
    <div className="flex w-full justify-between items-start gap-[2px]">
      {ORDERED_RESOURCES.map(type => {
        const tokenCount = tokens[type] || 0;
        const matchingCards = ownedCards.filter(c => c.providedBonus === type);
        const cardCount = matchingCards.length;
        const totalPower = tokenCount + cardCount;

        const isClickable = interactive && tokenCount > 0;
        const localizedName = language === 'ZH' ? (ZH as any)[type.toLowerCase()] || getDisplayName(type) : getDisplayName(type);

        return (
          <div key={type} data-testid={`resource-col-${type}`} className="flex flex-col items-center flex-1 min-w-[32px] group/stack relative" title={`${localizedName}: ${totalPower} (${t.wallet}: ${tokenCount}, ${t.engine}: ${cardCount})`}>
            
            {/* Engine (Cards) - Metallic Box Above */}
            <div 
              className={`flex items-center justify-center w-[22px] h-[18px] rounded-sm border border-[var(--color-gold-dark)] shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] mb-1 z-20 ${cardCount > 0 ? 'text-[var(--color-parchment)]' : 'text-gray-500 opacity-60 grayscale'}`} 
              style={{ backgroundImage: `linear-gradient(to bottom, ${TYPE_COLORS[type].start}, ${TYPE_COLORS[type].end})` }}
              data-testid={`card-count-${type}`}
            >
              <span className="text-[12px] font-bold font-fantasy leading-none drop-shadow-md">{cardCount}</span>
            </div>

            {/* The Main Resource Icon (Always visible, dim if no power) */}
            <div 
              className={`relative flex flex-col items-center justify-start h-8 w-8 z-20 ${totalPower === 0 ? 'opacity-30 grayscale' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'} ${isClickable ? 'cursor-pointer hover:-translate-y-1 transition-transform' : ''}`}
              onClick={() => isClickable && onTokenClick?.(type)}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <UnifiedToken type={type} size="sm" disableBlend={true} interactive={isClickable} />
              </div>
            </div>

            {/* Wallet (Tokens) - Circle Below */}
            <div className={`flex items-center justify-center w-[20px] h-[20px] rounded-full border border-gray-300 bg-gradient-to-b from-gray-700 to-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] mt-1 mb-1.5 z-20 ${tokenCount > 0 ? 'text-white' : 'text-gray-500 opacity-60 grayscale'}`} data-testid={`token-count-${type}`}>
              <span className="text-[11px] font-bold font-fantasy leading-none drop-shadow-md">{tokenCount}</span>
            </div>

            {/* Stacked Cards Section */}
            <div className="flex flex-col items-center w-full mt-1">
              {matchingCards.map((card, idx) => {
                const imgUrl = AssetRepository.getArt(card.assetId);
                return (
                  <div 
                    key={`${card.id}-${idx}`} 
                    className={`w-7 h-[14px] rounded-t-sm overflow-hidden border-t border-l border-r border-black/80 shadow-[0_-2px_4px_rgba(0,0,0,0.8)] ${idx > 0 ? '-mt-[10px]' : ''} relative`}
                    style={{ zIndex: matchingCards.length - idx }}
                  >
                     {imgUrl ? (
                         <img src={imgUrl} alt={card.name} className="w-full h-full object-cover origin-top scale-[1.3] card-stack-image" />
                     ) : (
                         <div className={`w-full h-full border-t-[3px] ${card.tier === 1 ? 'border-[var(--color-ui-border-tier1)] bg-black/40' : card.tier === 2 ? 'border-[var(--color-ui-border-tier2)] bg-black/60' : 'border-[var(--color-gold)] bg-[var(--color-gold-dark)]/40'}`} />
                     )}
                  </div>
                );
              })}
            </div>

          </div>
        );
      })}
    </div>
  );
};
