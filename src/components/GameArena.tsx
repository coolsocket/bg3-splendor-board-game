import React, { useState } from 'react';
import { PlayerBoard, type PlayerBoardProps } from './PlayerBoard';
import { useGameSystemStore } from '../store/gameSystemStore';
import { CardMarket, type CardMarketProps } from './CardMarket';
import { PublicResourcePool } from './PublicResourcePool';
import { PatronSlot } from './PatronSlot';
import type { ResourceType } from './Token';
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

  return (
    <div className="game-arena bg-underdark">
      <div className="sidebar">
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
        <PublicResourcePool
          resources={resources}
          onTokenClick={onTokenClick}
          disabledTokens={disabledTokens}
        />
        <CardMarket {...market} onCardInteract={onCardInteract} />
      </div>
      <div className="patron-area bg-obsidian-panel backdrop-blur-sm">
        <div className="patron-header">
          <h3 className="text-gold">Patrons</h3>
        </div>
        <div className="patron-cards-container">
          <PatronSlot />
          <PatronSlot />
          <PatronSlot />
          <PatronSlot />
        </div>
      </div>
    </div>
  );
};
