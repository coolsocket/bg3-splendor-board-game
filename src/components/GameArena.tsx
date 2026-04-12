import React, { useEffect } from 'react';
import { PlayerBoard, type PlayerBoardProps } from './PlayerBoard';
import { useGameSystemStore } from '../store/gameSystemStore';
import { CardMarket, type CardMarketProps } from './CardMarket';
import { PublicResourcePool } from './PublicResourcePool';
import type { ResourceType as TokenResourceType } from './TokenTypes';
import { ResourceType as DomainResourceType } from '../domain/models';
import { useTokenSelection } from '../hooks/useTokenSelection';
import { usePublicStore } from '../store/publicStore';
import { StagingArea } from './StagingArea';
import { PatronSlot } from './PatronSlot';
import { useUIStore } from '../store/uiStore';
import { usePlayerActions } from '../hooks/usePlayerActions';
import './GameArena.css';

const EventLog = React.lazy(() => import('./EventLog').then(m => ({ default: m.EventLog })));

import { AssetRepository } from '../repositories/assetRepository';
import { Avatar } from './common/Avatar';

export interface GameArenaProps {
  currentPlayer: PlayerBoardProps;
  opponents: PlayerBoardProps[];
  market: CardMarketProps;
  resources: Record<TokenResourceType, number>;
  onTokenClick?: (type: TokenResourceType) => void;
  onCardInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
  disabledTokens?: TokenResourceType[];
}

export const GameArena: React.FC<GameArenaProps> = ({
  currentPlayer,
  opponents,
  market,
  resources,
  onCardInteract,
  disabledTokens = []
}) => {
  const { isHistoryOpen, expandedPlayerName, setHistoryOpen, setExpandedPlayerName } = useUIStore();
  const { currentPlayerIndex } = useGameSystemStore();
  const availablePatrons = usePublicStore((state) => state.availablePatrons);

  const currentExpandedPlayer = expandedPlayerName || currentPlayer.playerName;

  const domainResources = Object.entries(resources).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {} as Record<string, number>);

  const playerTotalTokens = Object.values(currentPlayer.tokens).reduce((sum, count) => sum + (count || 0), 0);
  const { selectedTokens, selectToken, deselectToken, clearSelection, isValid, totalSelected } = useTokenSelection(domainResources, playerTotalTokens);

  const { handleConfirmTokens, handleCardInteract } = usePlayerActions({
    playerName: currentPlayer.playerName,
    selectedTokens,
    clearSelection,
    onCardInteractProp: onCardInteract
  });

  const tokenSelectedTokens = Object.entries(selectedTokens).reduce((acc, [key, value]) => {
    acc[key.toUpperCase()] = value;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      } else if (e.key === 'Enter') {
        if (isValid) {
          handleConfirmTokens();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, isValid, handleConfirmTokens]);

  return (
    <div className="game-arena bg-underdark">
      {totalSelected > 0 && (
        <StagingArea
          tokens={tokenSelectedTokens}
          onConfirm={handleConfirmTokens}
          onCancel={clearSelection}
          onRemoveToken={(type) => deselectToken(type.toLowerCase() as DomainResourceType)}
          isValid={isValid}
        />
      )}
      <div className="arena-content">
        <div className="sidebar overflow-y-auto">
          <div className="turn-tracker bg-obsidian-panel backdrop-blur-sm border border-gold-dark/30 p-2 flex items-center justify-center gap-3 my-2 rounded-lg shadow-heavy text-xs">
            <span className="text-gold text-xs uppercase tracking-wider font-serif font-bold">Turns</span>
            <div className="flex items-center gap-2">
              {[currentPlayer, ...opponents].map((player, index) => {
                const isActive = index === currentPlayerIndex;
                const avatarImg = AssetRepository.getAvatar(player.playerName);
                return (
                  <React.Fragment key={player.playerName}>
                    <div className="flex flex-col items-center gap-0.5">
                      <Avatar
                        imageUrl={avatarImg || undefined}
                        name={player.playerName}
                        size="sm"
                        isActive={isActive}
                        className={!isActive ? 'opacity-70' : ''}
                      />
                      <span className={`text-2xs ${isActive ? 'text-gold font-bold' : 'text-parchment opacity-70'}`}>{player.playerName}</span>
                    </div>
                    {index < [currentPlayer, ...opponents].length - 1 && (
                      <span className="text-gold opacity-50 text-sm font-bold self-center mb-2">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div className="opponents-container">
            {opponents.map((opponent, index) => {
              const isExpanded = opponent.playerName === currentExpandedPlayer;
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
            onTokenClick={(type) => selectToken(type.toLowerCase() as DomainResourceType)}
            disabledTokens={disabledTokens}
          />
          <div className="h-full overflow-y-auto pb-20">
            <CardMarket {...market} onCardInteract={handleCardInteract} />
          </div>
        </div>
        <div className="patron-column">
          <h3 className="text-gold font-serif mb-2 border-bottom border-gold/20 pb-1">Patrons</h3>
          {availablePatrons.map(patron => (
            <PatronSlot key={patron.id} patron={patron} />
          ))}
          {Array.from({ length: Math.max(0, 4 - availablePatrons.length) }).map((_, i) => (
            <PatronSlot key={`empty-${i}`} />
          ))}
        </div>
      </div>
      
      {/* Scroll Icon Trigger for History */}
      <button
        className="fixed bottom-6 right-6 bg-obsidian-panel border border-gold-dark/50 p-3 rounded-full shadow-heavy hover:bg-white/10 transition-colors z-40"
        onClick={() => setHistoryOpen(true)}
        aria-label="Open History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </button>

      <React.Suspense fallback={null}>
        <EventLog isOpen={isHistoryOpen} onClose={() => setHistoryOpen(false)} />
      </React.Suspense>
    </div>
  );
};
