/**
 * @module: Game Feature - Market
 * @component: Card
 * @material: --color-parchment, --color-gold, magic-circle
 * @purity: Stateful (Syncs with Action-Bus)
 * @dependency: useGameStateStore, usePlayerActions
 */
import React from 'react';
import { type ResourceType } from '../../TokenTypes';
import { CardBase } from '../../common/CardBase';
import { UnifiedToken } from '../../common/UnifiedToken';
import { PrestigeBadge } from '../../PrestigeBadge';
import { useGameStateStore } from '../../../store/gameStateStore';
import { usePlayerStore } from '../../../store/playerStore';
import { ZH, EN } from '../../../data/translations';
import { AssetRepository } from '../../../repositories/assetRepository';

const getCardInnerStyle = (tier: 1 | 2 | 3) => {
  const texture = AssetRepository.getParchmentTexture();
  const base = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  switch (tier) {
    case 1:
      return {
        ...base,
        backgroundImage: `linear-gradient(rgba(232, 226, 210, 0.5), rgba(216, 206, 180, 0.7)), url(${texture})`,
      };
    case 2:
      return {
        ...base,
        backgroundImage: `linear-gradient(rgba(235, 215, 195, 0.55), rgba(195, 155, 105, 0.75)), url(${texture})`,
      };
    case 3:
      return {
        ...base,
        backgroundImage: `linear-gradient(rgba(215, 200, 225, 0.65), rgba(135, 105, 145, 0.85)), url(${texture})`,
      };
    default:
      return base;
  }
};

export interface CardProps {
  id: string;
  assetId: string;
  name: string;
  tier: 1 | 2 | 3;
  prestigePoints: number;
  providedBonus: ResourceType;
  cost: Partial<Record<ResourceType, number>>;
  description?: string;
  isAffordable: boolean;
  missingResources?: { type: ResourceType; amount: number }[];
  isSelected?: boolean;
  onInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string, x?: number, y?: number) => void;
  isDeck?: boolean;
  deckCount?: number;
  isDetailed?: boolean;
  onClose?: () => void;
}

export const Card = React.memo(({
  id,
  assetId,
  name,
  tier,
  prestigePoints,
  providedBonus,
  cost,
  description,
  isAffordable,
  missingResources,
  isSelected = false,
  onInteract,
  isDeck = false,
  deckCount = 0,
  isDetailed = false,
  onClose
}: CardProps) => {
  const [isBuying, setIsBuying] = React.useState(false);
  const [isReserving, setIsReserving] = React.useState(false);
  const [isAwakening, setIsAwakening] = React.useState(false);

  const discardingInfo = useGameStateStore((state) => state.discardingInfo);
  const players = useGameStateStore((state) => state.players);
  const localPlayerName = usePlayerStore((state) => state.name);
  const localPlayerId = players.find(p => p.name === localPlayerName)?.id;
  const isDiscardingMe = discardingInfo?.playerId === localPlayerId;

  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;

  const currentPlayerIndex = useGameStateStore((state) => state.currentPlayerIndex);
  const isMyTurn = players[currentPlayerIndex]?.name === localPlayerName;
  const isActionAllowed = isMyTurn && !isDiscardingMe;
  const localizedName = language === 'ZH' ? (ZH.card_names as any)[name] || name : name;
  const localizedDescription = language === 'ZH' ? (ZH.card_descriptions as any)[description || ''] || description : description;
  
  const imageUrl = AssetRepository.getArt(assetId);
  
  React.useEffect(() => {
    const handleAwaken = (e: CustomEvent<{ cardId: string }>) => {
      if (e.detail.cardId === id) {
        setIsAwakening(true);
        setTimeout(() => setIsAwakening(false), 2000);
      }
    };
    window.addEventListener('awaken-card', handleAwaken as EventListener);
    return () => window.removeEventListener('awaken-card', handleAwaken as EventListener);
  }, [id]);

  const handleAction = (action: 'buy' | 'reserve' | 'select', e: React.MouseEvent) => {
    e.stopPropagation();
    if ((action === 'buy' || action === 'reserve') && !isActionAllowed) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    
    if (action === 'reserve') {
      setIsReserving(true);
      setTimeout(() => {
        if (onInteract) {
          onInteract(action, id, clientX, clientY);
        }
      }, 50);
    } else if (action === 'buy') {
      setIsBuying(true);
      setIsAwakening(true);
      setTimeout(() => {
        if (onInteract) {
          onInteract(action, id, clientX, clientY);
        }
      }, 50);
    } else {
      if (onInteract) {
        onInteract(action, id, e.clientX, e.clientY);
      }
    }
  };

  const getTierBorderClass = (tier: 1 | 2 | 3, isAffordable: boolean, isMyTurn: boolean) => {
    const active = isAffordable && isMyTurn;
    switch (tier) {
      case 1:
        return `border-[3px] rounded-sm ${active ? 'border-ui-border-tier1' : 'border-ui-border-tier1/40'} shadow-inner`;
      case 2:
        return `border-[3px] rounded-md ${active ? 'border-ui-border-tier2' : 'border-ui-border-tier2/40'} shadow-[inset_0_0_8px_rgba(255,255,255,0.3)]`;
      case 3:
        return `border-[4px] rounded-xl ${active ? 'border-gold' : 'border-gold/40'} shadow-[inset_0_0_15px_rgba(212,175,55,0.5)]`;
      default:
        return `border-2 rounded-lg ${active ? 'border-gold-light' : 'border-gold-light/30'}`;
    }
  };

  const activeGlow = isAffordable && isMyTurn;
  const borderClass = getTierBorderClass(tier, isAffordable, isMyTurn);

  const tierShadowClass = isDeck 
    ? (activeGlow ? 'shadow-lg shadow-[4px_6px_12px_rgba(0,0,0,0.7)] animate-card-breathe' : 'shadow-lg shadow-[4px_6px_12px_rgba(0,0,0,0.7)]')
    : tier === 1
    ? (activeGlow ? 'shadow-xl shadow-[0_0_30px_rgba(212,175,55,0.8)] animate-card-breathe' : 'shadow-xl shadow-[6px_10px_18px_rgba(0,0,0,0.8)]')
    : (activeGlow ? 'shadow-2xl shadow-[0_0_40px_rgba(212,175,55,0.9)] animate-card-breathe' : 'shadow-2xl shadow-[8px_14px_24px_rgba(0,0,0,0.9)]');

  // Extra physical decorations for Tier 2 and Tier 3
  const renderTierDecorations = () => {
    if (tier === 1) return null;
    return (
      <>
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${tier === 3 ? 'border-gold' : 'border-ui-border-tier2'} opacity-60 z-30 rounded-tl-lg pointer-events-none`} />
        <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${tier === 3 ? 'border-gold' : 'border-ui-border-tier2'} opacity-60 z-30 rounded-tr-lg pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${tier === 3 ? 'border-gold' : 'border-ui-border-tier2'} opacity-60 z-30 rounded-bl-lg pointer-events-none`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${tier === 3 ? 'border-gold' : 'border-ui-border-tier2'} opacity-60 z-30 rounded-br-lg pointer-events-none`} />
        {tier === 3 && <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none z-20" />}
      </>
    );
  };

  if (isDetailed) {
    return (
      <div 
        className={`group bg-bg-underdark ${borderClass} overflow-visible ${tierShadowClass} w-[420px] flex flex-col relative`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Detailed view of card ${name}`}
      >
        {renderTierDecorations()}
        {/* Close button (X) */}
        <button 
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-black border-2 border-[var(--color-gold-dark)] text-[var(--color-gold-light)] flex items-center justify-center hover:bg-[#fbbf24] hover:text-black transition-colors z-[100] shadow-2xl text-xl font-bold cursor-pointer"
          onClick={() => onClose && onClose()}
          aria-label="Close detail"
        >
          ×
        </button>
          <div 
          className="w-full flex flex-col relative overflow-hidden rounded-md flex-1 pb-0"
          style={getCardInnerStyle(tier)}
        >
          {/* Top Layout (Bonus Gem and Points) */}
          <div className="flex justify-between items-start p-4 z-20 relative">
             <UnifiedToken type={providedBonus} size="lg" />
             <div className="flex-1 flex justify-center items-center px-2">
                 <span className="text-xl font-bold font-fantasy text-[var(--color-text-primary)] tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
                     {localizedName}
                 </span>
             </div>
             {prestigePoints > 0 ? (
               <PrestigeBadge prestigePoints={prestigePoints} size="lg" className="shadow-2xl" />
             ) : (
               <div className="w-11 h-11" /> /* Spacer to balance flex-between */
             )}
          </div>

          {/* Center Graphic (Maximized) */}
          <div className="relative w-[360px] h-[360px] mx-auto mt-0 mb-4">
            <div className="bg-bg-obsidian w-full h-full overflow-hidden rounded-lg border-2 border-[var(--color-gold-dark)]/60 shadow-[0_0_40px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,0,0,1)] flex items-center justify-center relative">
              {imageUrl ? (
                <img src={imageUrl} alt={localizedName} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2a1b3d] via-[#141414] to-[#050505]" />
                  <div className="absolute inset-0 opacity-15 bg-center bg-contain bg-no-repeat m-2" style={{ backgroundImage: 'var(--svg-magic-circle)' }} />
                </>
              )}
            </div>
          </div>

          {/* Costs - Deep contrast area */}
          <div className="px-6 flex-1 flex flex-col justify-start mt-2 bg-black/20 py-4">
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {Object.entries(cost).map(([resource, amount]) => {
                if (amount && amount > 0) {
                  const resourceType = resource.toUpperCase() as ResourceType;
                  return (
                    <div key={resource} className="relative flex items-center justify-center scale-125">
                      <UnifiedToken 
                        type={resourceType} 
                        size="md" 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-black border border-[var(--color-gold-dark)] rounded-full w-6 h-6 flex items-center justify-center shadow-lg z-10">
                        <span className="font-fantasy text-[var(--color-parchment)] font-bold text-xs">{amount}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Lore Description */}
            {localizedDescription && (
              <div className="px-6 py-4 bg-black/40 border-l-4 border-[var(--color-gold-dark)]/50 italic text-[var(--color-text-primary)] font-serif text-center leading-relaxed text-sm mb-6 rounded-r-md mx-2">
                "{localizedDescription}"
              </div>
            )}
          </div>

          {/* Action Dock (Console Base) with colored buttons */}
          <div className="bg-[#0c0906] border-t border-gold-light p-4 flex gap-4 justify-center shadow-[inset_0_15px_15px_-15px_rgba(201,160,99,0.4),0_-4px_15px_rgba(0,0,0,0.8)] relative z-20 mt-auto">
            <div className="flex-1 relative group/acquire">
              <button
                className={`w-full h-full relative px-6 py-3 rounded border border-gold/80 bg-gradient-to-b from-ui-recruit-start to-ui-recruit-end text-text-primary font-fantasy font-bold text-lg cursor-pointer transition-all hover:brightness-125 hover:border-gold hover:shadow-[0_0_15px_rgba(17,122,101,0.8)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:brightness-100 flex flex-col items-center justify-center pointer-events-auto ${!isActionAllowed ? 'grayscale' : ''}`}
                onClick={(e) => handleAction('buy', e)}
                disabled={!isAffordable || !isActionAllowed}
              >
                <span className={(!isAffordable || !isActionAllowed) ? 'text-[#8b9996]' : ''}>{t.acquire}</span>
              </button>
              {!isAffordable && isMyTurn && missingResources && missingResources.length > 0 && (
                <div className="absolute -top-12 left-0 hidden group-hover/acquire:flex items-center bg-[#2a0808] border border-[#ff4444]/60 rounded-full px-3 py-1.5 shadow-[0_4px_12px_rgba(255,0,0,0.5)] whitespace-nowrap z-50 pointer-events-none animate-fade-in-up w-max">
                  <span className="text-xs text-[#ffdddd] uppercase font-bold mr-2 tracking-wider drop-shadow-sm">{t.missing}:</span>
                  <div className="flex gap-2 items-center">
                    {missingResources.slice(0, 5).map((mr) => (
                      <span key={mr.type} className="flex items-center text-sm text-[#ffbbbb] font-bold">
                        {mr.amount} 
                        <div className="ml-0.5 flex items-center justify-center">
                           <UnifiedToken type={mr.type.toUpperCase() as any} size="sm" disableBlend={true} />
                        </div>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              className={`px-6 py-3 rounded border border-gold/80 bg-gradient-to-b from-ui-plot-start to-ui-plot-end text-text-primary font-fantasy font-bold text-lg cursor-pointer transition-all hover:brightness-125 hover:border-gold hover:shadow-[0_0_15px_rgba(33,97,140,0.8)] active:scale-95 flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:brightness-100 ${!isActionAllowed ? 'grayscale' : ''}`}
              onClick={(e) => handleAction('reserve', e)}
              disabled={!isActionAllowed}
            >
              {t.reserve}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CardBase 
      id={isDetailed ? undefined : `card-${id}`}
      className={`group bg-bg-underdark ${borderClass} ${isAwakening ? 'p-[2px]' : ''} ${tierShadowClass} ${(isReserving || isBuying) ? 'opacity-0' : ''} ${isAwakening ? 'animate-card-awaken' : ''} ${isDeck ? 'is-deck' : ''} hover:scale-105 relative`}
      overflowVisible={tier === 2 || tier === 3}
      onClick={(e) => !isDeck && handleAction('select', e)}
      isHoverable={!isDeck}
      isSelected={isSelected}
      role={isDeck ? "button" : "article"}
      aria-label={isDeck ? `Deck tier ${tier}, count ${deckCount}` : `Card ${name}, tier ${tier}, prestige points ${prestigePoints}, bonus ${providedBonus}`}
      tabIndex={isDeck ? undefined : -1}
    >
      {renderTierDecorations()}
      
      {/* Neon Shine Border Effect on Awakening */}
      {isAwakening && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
          <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,var(--color-gold-dark),#9333ea,#dc2626,var(--color-gold-dark))] animate-spin-slow" />
        </div>
      )}

      {isDeck ? (
        <div 
          className="w-full h-full flex flex-col items-center justify-center relative z-10 bg-bg-underdark"
          style={getCardInnerStyle(tier)}
        >
          <span className="deck-count font-fantasy">{deckCount}</span>
          <span className="deck-label font-fantasy">{t.tier} {tier === 1 ? 'I' : tier === 2 ? 'II' : 'III'}</span>
        </div>
      ) : (
        <div 
          className="w-full h-full flex flex-col relative overflow-hidden rounded-md z-10"
          style={getCardInnerStyle(tier)}
        >
          {/* Header (Overlay) */}
          <div className="absolute top-0 left-0 right-0 flex justify-start items-start p-1.5 z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            {/* Gem (Bonus) top-left */}
            <UnifiedToken type={providedBonus} size="sm" className="ml-1.5 mt-1.5" />
          </div>

          {/* Image */}
          <div className={`bg-bg-obsidian overflow-hidden flex-grow flex items-center justify-center relative shadow-inner min-h-[150px] ${imageUrl ? '' : 'mix-blend-multiply'}`}>
            {imageUrl ? (
              <img src={imageUrl} alt={`Card ${id}`} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2a1b3d] via-[#141414] to-[#050505] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
                <div className="absolute inset-0 opacity-25 bg-center bg-contain bg-no-repeat m-2 animate-pulse" style={{ backgroundImage: 'var(--svg-magic-circle)' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              </>
            )}
            
            {/* Score top-right overlapping */}
            {prestigePoints > 0 && (
              <PrestigeBadge prestigePoints={prestigePoints} size="sm" className="absolute top-1 right-1 z-30 pointer-events-none" />
            )}
          </div>

          {/* Costs - In flow, single row layout */}
          <div className="relative z-10 mt-auto border-t border-amber-700/50">
            <div className="absolute inset-x-0 bottom-0 h-full bg-black/60 backdrop-blur-md z-0 pointer-events-none"></div>
            <div className="relative flex justify-center pt-1 pb-1 z-10">
              <div className="flex flex-nowrap justify-center gap-[2px]">
                {Object.entries(cost).map(([resource, amount]) => {
                  if (amount && amount > 0) {
                    const resourceType = resource.toUpperCase() as ResourceType;
                    return (
                      <div key={resource} className="relative flex items-center justify-center scale-[0.85]">
                        <UnifiedToken 
                          type={resourceType} 
                          size="sm" 
                          className="relative z-20"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-black border border-[var(--color-gold-dark)] rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-md z-30">
                          <span className="font-fantasy text-[var(--color-gold-light)] font-bold text-[9px] leading-none">{amount}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Affordability Highlight Overlay */}
          {activeGlow && !isDeck && (
            <div className="absolute inset-0 rounded-md ring-2 ring-[#ffd700] ring-offset-2 ring-offset-black shadow-[inset_0_0_40px_rgba(212,175,55,0.7)] mix-blend-screen animate-pulse pointer-events-none z-20"></div>
          )}
        </div>
      )}
    </CardBase>
  );
});
