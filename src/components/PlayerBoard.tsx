import React from 'react';
import './PlayerBoard.css';
import { Token, type ResourceType } from './Token';
import { Card, type CardProps } from './Card';
import { usePlayerStore } from '../store/playerStore';
import type { ResourceCollection, Card as DomainCard } from '../domain/models';
import { PrestigeBadge } from './PrestigeBadge';
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
      className={`border-container player-board ${viewMode}-view ${isCurrent ? 'current-player' : ''} ${props.isActive ? 'active-player glow-arcane' : 'inactive-player'}`}
      onClick={onClick}
      style={viewMode === 'summary' ? { cursor: 'pointer' } : undefined}
    >
      <div className="portrait-slot">
        <PlayerAvatar playerName={playerName} isActive={props.isActive} prestigePoints={prestigePoints} />
      </div>
      
      <div className="stats-grid">
        <ResourceMatrix tokens={tokens} bonuses={bonuses} />
        
        {patrons.length > 0 && (
          <div className="section patrons-section">
            <h3>Visited Patrons</h3>
            <div className="patron-slots-container">
              {[0, 1].map(index => {
                const patron = patrons[index];
                return patron ? (
                  <div key={patron.id} className="patron-slot filled">
                    {patron.imageUrl ? (
                      <img src={patron.imageUrl} alt={`Patron ${patron.id}`} className="patron-image" />
                    ) : (
                      <div className="patron-placeholder">
                        <span>Patron</span>
                        <span className="patron-vp">+{patron.prestigePoints} VP</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={`empty-slot-${index}`} className="patron-slot empty" />
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="reserved-cards">
        <div className="section reserved-cards-section">
          <h3>Reserved Cards</h3>
          <div className="reserved-slots-container">
            {[0, 1, 2].map(index => {
              const card = reservedCards[index];
              return card ? (
                <div key={card.id} className="reserve-slot filled micro-card">
                  <Card {...card} />
                </div>
              ) : (
                <div key={`empty-slot-${index}`} className="reserve-slot empty dashed-border" />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
