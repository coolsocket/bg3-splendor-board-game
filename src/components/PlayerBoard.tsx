import React from 'react';
import type { ResourceType } from './TokenTypes';
import { Card, type CardProps } from './Card';
import { usePlayerStore } from '../store/playerStore';
import type { ResourceCollection, Card as DomainCard } from '../domain/models';
import { PlayerAvatar } from './PlayerAvatar';
import { ResourceMatrix } from './ResourceMatrix';

export interface PlayerBoardProps {
  playerName: string;
  prestigePoints: number;
  tokens: Record<ResourceType, number>;
  ownedCards: CardProps[];
  reservedCards: CardProps[];
  patrons: Array<{ id: string; imageUrl?: string; prestigePoints: number }>;
  isCurrentPlayer?: boolean;
  isActive?: boolean;
  viewMode?: 'full' | 'summary';
  onClick?: () => void;
}

export const PlayerBoard: React.FC<PlayerBoardProps> = (props) => {
  const storePlayer = usePlayerStore();
  
  const isCurrent = props.isCurrentPlayer || props.playerName === storePlayer.name;
  
  const playerName = isCurrent ? storePlayer.name : props.playerName;
  const prestigePoints = isCurrent ? storePlayer.prestigePoints : props.prestigePoints;
  
  const mapStoreTokens = (resources: ResourceCollection): Record<ResourceType, number> => {
    const result: Record<ResourceType, number> = {
      RADIANT_GEM: 0,
      ARCANE_CRYSTAL: 0,
      NATURES_BLESSING: 0,
      INFERNAL_IRON: 0,
      DARK_QUARTZ: 0,
      TRUE_SOUL_TADPOLE: 0
    };
    for (const [type, amount] of Object.entries(resources)) {
      result[type.toUpperCase() as ResourceType] = amount || 0;
    }
    return result;
  };

  const mapStoreCards = (cards: DomainCard[]): CardProps[] => {
    return cards.map(card => {
      const cost: Partial<Record<ResourceType, number>> = {};
      for (const [type, amount] of Object.entries(card.cost)) {
        cost[type.toUpperCase() as ResourceType] = amount;
      }
      return {
        id: card.id,
        tier: card.tier as 1 | 2 | 3,
        prestigePoints: card.points,
        providedBonus: card.bonus.toUpperCase() as ResourceType,
        cost,
        isAffordable: false,
        isSelected: false,
      };
    });
  };

  const tokens = isCurrent ? mapStoreTokens(storePlayer.resources) : props.tokens;
  const ownedCards = isCurrent ? mapStoreCards(storePlayer.acquiredCards) : props.ownedCards;
  const reservedCards = isCurrent ? mapStoreCards(storePlayer.reservedCards) : props.reservedCards;
  
  const patrons = isCurrent ? storePlayer.patrons.map(p => ({
    id: p.id,
    prestigePoints: p.points,
    imageUrl: undefined as string | undefined,
  })) : props.patrons;

  const bonuses: Record<ResourceType, number> = isCurrent 
    ? mapStoreTokens(storePlayer.bonuses)
    : ownedCards.reduce((acc, card) => {
        const bonus = card.providedBonus;
        acc[bonus] = (acc[bonus] || 0) + 1;
        return acc;
      }, {} as Record<ResourceType, number>);



  const { viewMode = 'full', onClick } = props;

  return (
    <div 
      className={`relative bg3-panel p-4 pb-6 text-[#E8E2D2] font-fantasy w-[260px] max-w-[260px] flex-shrink-0 min-w-0 max-h-[90vh] overflow-y-auto transition-all duration-300 ${props.isActive ? 'animate-gold-breathe scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 'brightness-[0.6]'} ${isCurrent ? 'shadow-[0_4px_20px_rgba(138,43,226,0.15)]' : ''} ${viewMode === 'summary' ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Decorative Studs */}
      <div className="absolute top-[5px] left-[5px] w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>
      <div className="absolute top-[5px] right-[5px] w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>
      <div className="absolute bottom-[5px] left-[5px] w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>
      <div className="absolute bottom-[5px] right-[5px] w-2 h-2 bg-stud shadow-stud rounded-full z-[10]"></div>

      <div className="mb-4">
        <PlayerAvatar playerName={playerName} isActive={props.isActive} prestigePoints={prestigePoints} />
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-transparent border-none shadow-none px-0">
          <h3 className="font-fantasy text-sm text-[#94a3b8] mb-2">Assets</h3>
          <ResourceMatrix tokens={tokens} bonuses={bonuses} />
        </div>
        
        {patrons.length > 0 && (
          <div className="bg-[#222731] border border-[#2e3542] rounded-md p-3">
            <h3 className="font-fantasy text-[clamp(0.9rem,1.5vw,1.1rem)] text-[#e2e8f0] border-b border-[#2e3542] pb-2 mb-2">Visited Patrons</h3>
            <div className="flex gap-3 justify-start mt-2">
              {[0, 1].map(index => {
                const patron = patrons[index];
                return patron ? (
                  <div key={patron.id} className="w-[60px] h-[60px] rounded-full relative overflow-hidden flex items-center justify-center border border-[#d4af37] bg-[#1a1c23]">
                    {patron.imageUrl ? (
                      <img src={patron.imageUrl} alt={`Patron ${patron.id}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full p-1 text-center text-[0.65rem] text-[#a0a5b5]">
                        <span>Patron</span>
                        <span className="font-fantasy text-[#d4af37] font-bold mt-1 text-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">+{patron.prestigePoints} VP</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={`empty-slot-${index}`} className="w-[60px] h-[60px] rounded-full relative overflow-hidden flex items-center justify-center border-2 border-dashed border-[#3a3f4d] bg-black/20" />
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="bg-[#222731] border border-[#2e3542] rounded-md p-4">
          <h3 className="font-fantasy text-[clamp(0.9rem,1.5vw,1.1rem)] text-[#e2e8f0] border-b border-[#2e3542] pb-2 mb-2">Reserved Cards</h3>
          <div className="flex gap-3 justify-start mt-2 p-2 pb-4">
            {[0, 1, 2].map(index => {
              const card = reservedCards[index];
              return card ? (
                <div key={card.id} className="w-[60px] aspect-[2/3] rounded-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 transform scale-[0.375] origin-top-left pointer-events-none">
                    <Card {...card} />
                  </div>
                </div>
              ) : (
                <div 
                  key={`empty-slot-${index}`} 
                  className="w-[60px] aspect-[2/3] rounded-md relative border-2 border-dashed border-[#bf953f] bg-[#0a0a0f]/60 shadow-inner"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(191, 149, 63, 0.05), rgba(191, 149, 63, 0.05) 10px, rgba(0, 0, 0, 0) 10px, rgba(0, 0, 0, 0) 20px)' }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
