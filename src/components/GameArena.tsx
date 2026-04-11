import React, { useState, useEffect } from 'react';
import { PlayerBoard, type PlayerBoardProps } from './PlayerBoard';
import { useGameSystemStore } from '../store/gameSystemStore';
import { CardMarket, type CardMarketProps } from './CardMarket';
import { PublicResourcePool } from './PublicResourcePool';
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
      <PublicResourcePool
        onTokenClick={onTokenClick}
        disabledTokens={disabledTokens}
      />
      <div className="initiative-tracker bg-obsidian-panel backdrop-blur-sm border border-gold-dark/30 p-2 flex items-center justify-center gap-4 my-2 rounded-lg">
        <span className="text-gold text-sm uppercase tracking-wider font-serif">Initiative:</span>
        <div className="flex items-center gap-2">
          {[currentPlayer, ...opponents].map((player, index) => {
            const isActive = index === currentPlayerIndex;
            return (
              <div key={player.playerName} className={`flex items-center gap-1 px-3 py-1 rounded ${isActive ? 'bg-gold-500/20 border border-gold-500' : 'bg-black/40 border border-gray-700 opacity-70'}`}>
                {isActive && <span className="text-gold text-sm">▶</span>}
                <span className={`text-sm ${isActive ? 'text-gold font-bold' : 'text-parchment'}`}>{player.playerName}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="arena-content">
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
            <CardMarket {...market} onCardInteract={onCardInteract} />
          </div>
        </div>
      </div>
    </div>
  );
};
