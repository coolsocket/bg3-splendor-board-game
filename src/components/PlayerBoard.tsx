import React from 'react';
import type { ResourceType } from './TokenTypes';
import { Card, type CardProps } from './features/market/Card';
import { HeroAvatar } from './common/HeroAvatar';
import { AssetRepository } from '../repositories/assetRepository';
import { ResourceStack } from './ResourceStack';
import { PrestigeBadge } from './PrestigeBadge';
import { useGameStateStore } from '../store/gameStateStore';
import { ZH, EN } from '../data/translations';
import { GAME_CONFIG } from '../config/gameConfig';

// Trigger hook test 2
export interface PlayerBoardProps {
  playerName: string;
  prestigePoints: number;
  tokens: Record<ResourceType, number>;
  ownedCards: CardProps[];
  reservedCards: CardProps[];
  patrons: Array<{ id: string; assetId: string; prestigePoints: number }>;
  isCurrentPlayer?: boolean;
  isActive?: boolean;
  isLocalPlayer?: boolean;
  viewMode?: 'full' | 'summary';
  onClick?: () => void;
  onReservedCardInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
  interactiveTokens?: boolean;
  onTokenClick?: (type: ResourceType) => void;
}

export const PlayerBoard: React.FC<PlayerBoardProps> = ({
  playerName,
  prestigePoints,
  tokens,
  ownedCards,
  reservedCards,
  patrons,
  isCurrentPlayer,
  isActive,
  isLocalPlayer = false,
  viewMode = 'full',
  onClick,
  onReservedCardInteract,
  interactiveTokens = false,
  onTokenClick
}) => {
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;
  
  const [isBouncing, setIsBouncing] = React.useState(false);

  React.useEffect(() => {
    const handleImpact = () => {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 300);
    };
    window.addEventListener('token-impact', handleImpact);
    return () => window.removeEventListener('token-impact', handleImpact);
  }, []);

  return (
    <div 
      id={`player-board-${playerName.replace(/\s+/g, '-')}`}
      className={`relative bg3-panel p-3 pb-3 text-[var(--color-text-primary)] font-fantasy flex-shrink-0 min-w-0 transition-all duration-1000 ease-in-out flex flex-col ${isActive ? 'z-50 opacity-100 brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.6),inset_0_0_15px_rgba(212,175,55,0.2)]' : 'opacity-70 brightness-50 grayscale-[30%]'} ${viewMode === 'summary' ? 'cursor-pointer' : ''} ${isBouncing ? 'animate-wallet-bounce' : ''}`}
      style={{ width: GAME_CONFIG.UI.PLAYER_BOARD_WIDTH, maxWidth: GAME_CONFIG.UI.PLAYER_BOARD_WIDTH }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      } : undefined}
    >
      {/* Decorative Studs */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>
      <div className="absolute top-1 right-1 w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>

      {/* Top Section: Avatar & Name */}
      <div className="flex items-center gap-3 mb-2 w-full">
        <div className="relative shrink-0">
          {isActive && (
            <div className="absolute inset-[-2px] rounded-full animate-arcane-pulse z-0 pointer-events-none" />
          )}
          <div className="relative z-10">
            <HeroAvatar
              imageUrl={AssetRepository.getAvatar(playerName) || undefined}
              name={playerName}
              className="w-16 h-16 rounded-full"
            />
          </div>
          {prestigePoints !== undefined && (
            <PrestigeBadge prestigePoints={prestigePoints} size="sm" className="absolute -top-2 -right-2 z-20" />
          )}
        </div>
        <div className="flex flex-col items-start gap-1 flex-grow">
          <div 
            className={`text-lg font-bold font-fantasy text-left whitespace-normal break-all shadow-lg ${isCurrentPlayer ? 'text-ui-text-accent' : 'text-text-primary'}`}
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8)' }}
          >
            {playerName}
          </div>
          {isLocalPlayer && (
            <span className="text-[10px] font-bold bg-gold text-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-md">
              You
            </span>
          )}
        </div>
      </div>

      {viewMode === 'full' && (
        <>
          <div className="w-full mb-2">
            <ResourceStack 
              tokens={tokens} 
              ownedCards={ownedCards}
              interactive={interactiveTokens}
              onTokenClick={onTokenClick}
            />
          </div>
          
          <hr className="border-t border-pure-black shadow-[0_1px_0_rgba(255,255,255,0.1)] mb-2 shrink-0" />
          
          <div className="flex flex-col gap-2 flex-grow pr-1">
            {patrons.length > 0 && (
              <div className="pt-1">
                <h3 className="font-fantasy text-[clamp(0.75rem,1.2vw,0.9rem)] text-ui-border-tier2 pb-1 mb-1">{t.patrons}</h3>
                <div className="flex gap-2 justify-start mt-1">
                  {[0, 1, 2].map(index => {
                    const patron = patrons[index];
                    const imageUrl = patron ? AssetRepository.getArt(patron.assetId) : null;
                    return patron ? (
                      <div key={patron.id} className="w-10 h-10 rounded-full relative overflow-visible flex items-center justify-center border border-gold bg-bg-underdark shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {imageUrl ? (
                            <img src={imageUrl} alt={`Patron ${patron.id}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full p-1 text-center text-[0.55rem] text-text-secondary">
                              <span>{t.patron}</span>
                            </div>
                          )}
                        </div>
                        <PrestigeBadge prestigePoints={patron.prestigePoints} size="sm" className="absolute -top-1 -right-1 z-30" />
                      </div>
                    ) : (
                      <div key={`empty-slot-${index}`} className="w-10 h-10 rounded-full relative overflow-hidden flex items-center justify-center border border-dashed border-[#3a3f4d] bg-black/20 shrink-0" />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-2 shrink-0 border-t border-pure-black shadow-[0_1px_0_rgba(255,255,255,0.1)] pt-2">
            <div className="font-fantasy text-[clamp(0.75rem,1.2vw,0.9rem)] text-ui-border-tier2 pb-1 flex items-center justify-between select-none">
              <span>{t.reservedCards} ({reservedCards.filter(Boolean).length}/3)</span>
            </div>
              <div className="flex gap-2 justify-start mt-2 pb-1 items-start">
                {[0, 1, 2].map(index => {
                  const card = reservedCards[index];
                  return card ? (
                    <div 
                      key={card.id} 
                      className="w-11 h-[66px] rounded-md relative border border-ui-border-reserved shrink-0 flex items-center justify-center overflow-visible group/reserved cursor-pointer hover:border-gold transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onReservedCardInteract) onReservedCardInteract('select', card.id);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          if (onReservedCardInteract) onReservedCardInteract('select', card.id);
                        }
                      }}
                    >
                      <div className="w-[120px] transform scale-[0.35] pointer-events-none flex items-center justify-center shrink-0">
                        <Card {...card} />
                      </div>
                      <div className="hidden group-hover/reserved:block fixed z-[9999] pointer-events-none scale-100 bg-black/90 rounded-lg shadow-heavy p-1 border border-gold-dark/60 w-[200px]"
                           style={{ left: '14rem' }}>
                        <Card {...card} />
                      </div>
                    </div>
                  ) : (
                    <div 
                      key={`empty-slot-${index}`} 
                      className="w-11 h-[66px] rounded-md relative border border-dashed border-amber-500/30 bg-[var(--color-ui-bg-panel)]/40 shadow-inner shrink-0"
                      style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(191, 149, 63, 0.05), rgba(191, 149, 63, 0.05) 5px, rgba(0, 0, 0, 0) 5px, rgba(0, 0, 0, 0) 10px)' }}
                    />
                  );
                })}
              </div>
          </div>
        </>
      )}
    </div>
  );
};
