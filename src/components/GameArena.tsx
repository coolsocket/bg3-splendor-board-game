import React, { useState, useEffect } from 'react';
import { PlayerBoard, type PlayerBoardProps } from './PlayerBoard';
import { useGameSystemStore } from '../store/gameSystemStore';
import { CardMarket, type CardMarketProps } from './CardMarket';
import { PublicResourcePool } from './PublicResourcePool';
import { PatronSlot } from './PatronSlot';
import type { ResourceType } from './Token';
import { useTokenSelection } from '../hooks/useTokenSelection';
import { usePublicStore } from '../store/publicStore';
import './GameArena.css';

export interface GameArenaProps {
  currentPlayer: PlayerBoardProps;
  opponents: PlayerBoardProps[];
  market: CardMarketProps;
  resources: Record<ResourceType, number>;
  onTokenClick?: (type: ResourceType) => void;
  onCardInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
  disabledTokens?: ResourceType[];
}

export const GameArena: React.FC<GameArenaProps> = ({
  currentPlayer,
  opponents,
  market,
  resources,
  onTokenClick,
  onCardInteract,
  disabledTokens = []
}) => {
  const [expandedPlayerName, setExpandedPlayerName] = useState<string>(currentPlayer.playerName);
  const { currentPlayerIndex } = useGameSystemStore();
  const { availablePatrons } = usePublicStore();

  const playerTotalTokens = Object.values(currentPlayer.tokens).reduce((sum, count) => sum + (count || 0), 0);
  const { selectedTokens, clearSelection, isValid } = useTokenSelection(resources, playerTotalTokens);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      } else if (e.key === 'Enter') {
        if (isValid) {
          console.log('Confirmed token selection:', selectedTokens);
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, isValid, selectedTokens]);

  return (
    <div className="game-arena bg-underdark">
      <div className="sidebar overflow-y-auto">
        <div className="opponents-container">
          {opponents.map((opponent, index) => {
            const isExpanded = opponent.playerName === expandedPlayerName;
            return (
              <PlayerBoard
                key={index}
                {...opponent}
                isCurrentPlayer={false}
                isActive={currentPlayerIndex === index + 1}
                viewMode={isExpanded ? 'full' : 'summary'}
                onClick={() => !isExpanded && setExpandedPlayerName(opponent.playerName)}
              />
            );
          })}
        </div>
        <div className="current-player-container">
          <PlayerBoard {...currentPlayer} isCurrentPlayer={true} isActive={currentPlayerIndex === 0} />
        </div>
      </div>
      <div className="main-area bg-camp-table">
        <div className="h-full overflow-y-auto pb-20">
          <PublicResourcePool
            resources={resources}
            onTokenClick={onTokenClick}
            disabledTokens={disabledTokens}
          />
          <CardMarket {...market} onCardInteract={onCardInteract} />
        </div>
      </div>
      <div className="patron-area bg-obsidian-panel backdrop-blur-sm overflow-y-auto">
        <div className="patron-header">
          <h3 className="text-gold">Patrons</h3>
        </div>
        <div className="patron-cards-container">
          {availablePatrons.map(patron => (
            <PatronSlot key={patron.id} patron={patron} />
          ))}
          {Array.from({ length: Math.max(0, 4 - availablePatrons.length) }).map((_, i) => (
            <PatronSlot key={`empty-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
