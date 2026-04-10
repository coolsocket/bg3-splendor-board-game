import React from 'react';
import './PlayerBoard.css';
import { Token, type ResourceType } from './Token';
import { Card, type CardProps } from './Card';
import { usePlayerStore } from '../store/playerStore';
import type { ResourceCollection, Card as DomainCard } from '../domain/models';

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

  const resourceTypes: ResourceType[] = [
    'RADIANT_GEM',
    'ARCANE_CRYSTAL',
    'NATURES_BLESSING',
    'INFERNAL_IRON',
    'DARK_QUARTZ',
    'TRUE_SOUL_TADPOLE'
  ];

  const { viewMode = 'full', onClick } = props;

  if (viewMode === 'summary') {
    const totalTokens = Object.values(tokens).reduce((a, b) => a + b, 0);
    return (
      <div 
        className={`player-board summary-view ${isCurrent ? 'current-player' : ''} ${props.isActive ? 'active-player' : ''}`}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="player-board-header">
          <h2 className="player-name">
            {props.isActive && <span className="active-arrow">▶ </span>}
            {playerName}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {props.isActive && <span className="hourglass">⏳</span>}
            <div className="prestige-badge">
              <span className="prestige-label">Prestige</span>
              <span className="prestige-value">{prestigePoints}</span>
            </div>
          </div>
        </div>
        <div className="player-board-content" style={{ padding: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}>
            <span>🃏 {reservedCards.length}</span>
            <span style={{ color: '#4a5061' }}>|</span>
            <span>💎 {totalTokens}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`player-board ${isCurrent ? 'current-player' : ''} ${props.isActive ? 'active-player' : ''}`}>


      <div className="player-board-header">
        <h2 className="player-name">
          {props.isActive && <span className="active-arrow">▶ </span>}
          {playerName}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {props.isActive && <span className="hourglass">⏳</span>}
          <div className="prestige-badge">
            <span className="prestige-label">Prestige</span>
            <span className="prestige-value">{prestigePoints}</span>
          </div>
        </div>
      </div>

      <div className="player-board-content">
        {/* Resource Grid */}
        <div className="section resource-grid-section">
          <h3>Resources & Bonuses</h3>
          <div className="asset-matrix">
            {resourceTypes.map(type => (
              <Token key={`token-${type}`} type={type} count={tokens[type] || 0} />
            ))}
            {resourceTypes.map(type => (
              <div key={`bonus-${type}`} className={`bonus-item ${type.toLowerCase()}`} title={`Bonus: ${bonuses[type] || 0}`}>
                <span className="bonus-value">{bonuses[type] || 0}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Reserved Cards */}
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
                <div key={`empty-slot-${index}`} className="reserve-slot empty" />
              );
            })}
          </div>
        </div>

        {/* Visited Patrons */}
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
      </div>
    </div>
  );
};
