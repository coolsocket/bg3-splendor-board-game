import React, { useState, useEffect } from 'react';
import { PlayerBoard, type PlayerBoardProps } from './PlayerBoard';
import { useGameSystemStore } from '../store/gameSystemStore';
import { CardMarket, type CardMarketProps } from './CardMarket';
import { PublicResourcePool } from './PublicResourcePool';
import type { ResourceType } from './Token';
import { useTokenSelection } from '../hooks/useTokenSelection';
import { usePublicStore } from '../store/publicStore';
import { StagingArea } from './StagingArea';
import { EventLog } from './EventLog';
import { useEventLogStore } from '../store/eventLogStore';
import './GameArena.css';
import galeImg from '../assets/gale_portrait.png';
import astarionImg from '../assets/astarion_portrait.png';

const getAvatarImg = (name: string) => {
  if (name === 'Gale') return galeImg;
  if (name === 'Astarion') return astarionImg;
  return null;
};

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
  const { selectedTokens, selectToken, deselectToken, clearSelection, isValid, totalSelected } = useTokenSelection(resources, playerTotalTokens);

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

  const handleConfirmTokens = () => {
    console.log('Confirmed token selection:', selectedTokens);
    const eventLogStore = useEventLogStore.getState();
    eventLogStore.addEvent(`${currentPlayer.playerName} took tokens: ${JSON.stringify(selectedTokens)}`);
    // Here we would normally send action to network manager
    clearSelection();
  };

  const handleCardInteract = (action: 'buy' | 'reserve' | 'select', cardId: string) => {
    const eventLogStore = useEventLogStore.getState();
    
    if (action === 'reserve') {
      eventLogStore.addEvent(`${currentPlayer.playerName} reserved card ${cardId}`);
      // STORY-333: Implement wild card auto-trigger
      const publicStore = usePublicStore.getState();
      const tadpoleCount = publicStore.availableResources['TRUE_SOUL_TADPOLE'] || 0;
      if (tadpoleCount > 0) {
        eventLogStore.addEvent(`Auto-triggered Wildcard (Tadpole) from pool`);
        // Logic placeholder: in a real app we would update stores or send network action
      }
    } else if (action === 'buy') {
      eventLogStore.addEvent(`${currentPlayer.playerName} bought card ${cardId}`);
    }
    
    if (onCardInteract) {
      onCardInteract(action, cardId);
    }
  };

  return (
    <div className="game-arena bg-underdark">
      <PublicResourcePool
        onTokenClick={selectToken}
        disabledTokens={disabledTokens}
      />
      
      {totalSelected > 0 && (
        <StagingArea
          tokens={selectedTokens}
          onConfirm={handleConfirmTokens}
          onCancel={clearSelection}
          onRemoveToken={deselectToken}
          isValid={isValid}
        />
      )}
      <div className="turn-tracker bg-obsidian-panel backdrop-blur-sm border border-gold-dark/30 p-3 flex items-center justify-center gap-6 my-2 rounded-lg shadow-heavy">
        <span className="text-gold text-sm uppercase tracking-wider font-serif font-bold">Turn Order</span>
        <div className="flex items-center gap-3">
          {[currentPlayer, ...opponents].map((player, index) => {
            const isActive = index === currentPlayerIndex;
            const avatarImg = getAvatarImg(player.playerName);
            return (
              <React.Fragment key={player.playerName}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`relative w-12 h-12 rounded-full border-2 ${isActive ? 'border-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'border-gray-600 opacity-70'} overflow-hidden`}>
                    {avatarImg ? (
                      <img src={avatarImg} alt={player.playerName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                        {player.playerName.charAt(0)}
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-gold animate-pulse rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-gold font-bold' : 'text-parchment opacity-70'}`}>{player.playerName}</span>
                </div>
                {index < [currentPlayer, ...opponents].length - 1 && (
                  <span className="text-gold opacity-50 text-xl font-bold self-center mb-4">→</span>
                )}
              </React.Fragment>
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
            <CardMarket {...market} onCardInteract={handleCardInteract} />
          </div>
        </div>
      </div>
      <EventLog />
    </div>
  );
};
