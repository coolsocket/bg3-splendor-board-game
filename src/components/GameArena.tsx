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
    <main 
      className="flex flex-col gap-4 p-4 h-screen box-border relative overflow-hidden bg-[var(--color-bg-underdark)] bg-gradient-to-b from-[var(--color-bg-underdark)] to-[var(--color-bg-underdark-end)] text-[var(--color-text-primary)]"
      style={{ cursor: "url('../assets/dagger_cursor.png'), auto" }}
    >
      <h1 className="sr-only">Splendor Game Arena</h1>
      {/* Vignette and Noise Overlays */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-[var(--z-dropdown)]"></div>
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-15 z-[var(--z-dropdown)]"
        style={{ backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0"/></filter><rect width="100" height="100" filter="url(%23n)" opacity="0.3"/></svg>\')' }}
      ></div>

      {totalSelected > 0 && (
        <StagingArea
          tokens={tokenSelectedTokens}
          onConfirm={handleConfirmTokens}
          onCancel={clearSelection}
          onRemoveToken={(type) => deselectToken(type.toLowerCase() as DomainResourceType)}
          isValid={isValid}
        />
      )}
      
      <div className="bg-[var(--color-bg-obsidian)] backdrop-blur-sm border border-gold-dark/30 p-2 flex items-center justify-center gap-3 my-2 rounded-lg shadow-heavy text-xs mx-auto w-fit max-w-lg">
        <span className="text-[#c9a063] text-xs uppercase tracking-wider font-serif font-bold">Turns</span>
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
                  <span className={`text-2xs text-[#E8E2D2] ${isActive ? 'font-bold' : ''}`}>{player.playerName}</span>
                </div>
                {index < [currentPlayer, ...opponents].length - 1 && (
                  <span className="text-[#c9a063] opacity-50 text-sm font-bold self-center mb-2">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr_200px] grid-cols-1 gap-4 flex-grow min-h-0">
        <div className="flex flex-col gap-6 items-stretch max-w-[300px] overflow-y-auto pl-2">
          
          <div className="flex flex-col gap-6 relative before:content-[''] before:absolute before:top-4 before:left-[10px] before:w-[1px] before:h-[calc(100%-2rem)] before:bg-gradient-to-b before:from-[rgba(201,160,99,0.8)] before:to-[rgba(201,160,99,0.2)] before:z-[var(--z-base)]">
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
          
          <div className="mt-auto">
            <PlayerBoard {...currentPlayer} isCurrentPlayer={true} isActive={currentPlayerIndex === 0} />
          </div>
        </div>

        <div 
          className="flex flex-col gap-6 p-6 rounded-lg shadow-[0_0_20px_rgba(181,138,62,0.1),inset_0_0_50px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)] border border-[rgba(181,138,62,0.2)] min-h-0 bg-[#503c28]/30 bg-no-repeat bg-center bg-contain"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, rgba(80, 60, 40, 0.3) 0%, rgba(5, 3, 2, 0.95) 100%), url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><g fill="none" stroke="%23c9a063" stroke-width="1" opacity="0.05"><circle cx="250" cy="250" r="200"/><circle cx="250" cy="250" r="150"/><circle cx="250" cy="250" r="100"/><polygon points="250,50 300,200 450,250 300,300 250,450 200,300 50,250 200,200"/><polygon points="250,100 280,220 400,250 280,280 250,400 220,280 100,250 220,220"/></g></svg>\')'
          }}
        >
          <PublicResourcePool
            onTokenClick={(type) => selectToken(type.toLowerCase() as DomainResourceType)}
            disabledTokens={disabledTokens}
          />
          <div className="h-full overflow-y-auto pb-20">
            <CardMarket {...market} onCardInteract={handleCardInteract} />
          </div>
        </div>

        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="flex flex-col gap-6 p-4 rounded-lg border border-[rgba(181,138,62,0.2)] bg-[var(--color-bg-obsidian)] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-[#c9a063] items-center" tabIndex={0} role="region" aria-label="Available Patrons">
          <h3 className="text-[#c9a063] font-serif mb-2 border-b border-[#c9a063]/20 pb-1 w-full text-center">Patrons</h3>
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
        className="fixed bottom-6 right-6 bg-[var(--color-bg-obsidian)] border border-gold-dark/50 p-3 rounded-full shadow-heavy hover:bg-white/10 transition-colors z-40"
        onClick={() => setHistoryOpen(true)}
        aria-label="Open History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#c9a063]">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </button>

      <React.Suspense fallback={null}>
        <EventLog isOpen={isHistoryOpen} onClose={() => setHistoryOpen(false)} />
      </React.Suspense>
    </main>
  );
};
