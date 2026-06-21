import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStateStore } from '../store/gameStateStore';
import { CardMarket } from './features/market/CardMarket';
import { PlayerBoard } from './PlayerBoard';
import { usePlayerStore } from '../store/playerStore';
import { AssetRepository } from '../repositories/assetRepository';
import { CardTier, ResourceType as DomainResourceType, GamePhase } from '../domain/models';
import { type ResourceType as TokenResourceType } from './TokenTypes';
import { useTokenSelection } from '../hooks/useTokenSelection';
import { usePlayerActions } from '../hooks/usePlayerActions';
import { TokenTransfer, triggerTokenTransfer } from './common/TokenTransfer';
import { CardFlight } from './common/CardFlight';
import { PatronFlight } from './common/PatronFlight';
import { TurnAnnouncer } from './common/TurnAnnouncer';
import { Modal } from './common/Modal';
import { PrestigeBadge } from './PrestigeBadge';
import { UnifiedToken } from './common/UnifiedToken';
import { canAffordCard, calculateMissingResources } from '../domain/rules/purchaseRules';
import { getWinners } from '../domain/logic';
import { type Card as DomainCard } from '../domain/models';
import { Card, type CardProps } from './features/market/Card';
import { ZH, EN } from '../data/translations';
import { PublicResourcePool } from './PublicResourcePool';
import { PatronSlot } from './PatronSlot';
import { StagingArea } from './StagingArea';
import { NotificationOverlay } from './common/NotificationOverlay';
import { VictoryVFX } from './common/VictoryVFX';
import { DevToolsPanel } from './common/DevToolsPanel';
import { GAME_CONFIG } from '../config/gameConfig';
import { useAudioStore } from '../store/audioStore';
import { TopRightHUD } from './common/TopRightHUD';

export const GameArena: React.FC = () => {
  const players = useGameStateStore((state) => state.players);
  const currentPlayerIndex = useGameStateStore((state) => state.currentPlayerIndex);
  const availableResources = useGameStateStore((state) => state.availableResources);
  const faceUpCards = useGameStateStore((state) => state.faceUpCards);
  const availablePatrons = useGameStateStore((state) => state.availablePatrons);
  const reset = useGameStateStore((state) => state.reset);
  const phase = useGameStateStore((state) => state.phase);
  const language = useGameStateStore((state) => state.language);
  const turnNumber = useGameStateStore((state) => state.turnNumber);

  const t = language === 'ZH' ? ZH : EN;

  const [expandedPlayerName, setExpandedPlayerName] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [detailedCardId, setDetailedCardId] = useState<string | null>(null);
  const [detailedPatronId, setDetailedPatronId] = useState<string | null>(null);

  const globalVolume = useAudioStore((state) => state.globalVolume);
  const bgmVolume = useAudioStore((state) => state.bgmVolume);
  const setVolume = useAudioStore((state) => state.setVolume);
  const setBgmVolume = useAudioStore((state) => state.setBgmVolume);
  const isBgmPlaying = useAudioStore((state) => state.isBgmPlaying);
  const isShuffle = useAudioStore((state) => state.isShuffle);
  const playBgm = useAudioStore((state) => state.playBgm);
  const pauseBgm = useAudioStore((state) => state.pauseBgm);
  const nextBgm = useAudioStore((state) => state.nextBgm);
  const prevBgm = useAudioStore((state) => state.prevBgm);
  const setShuffle = useAudioStore((state) => state.setShuffle);
  const getCurrentTrackName = useAudioStore((state) => state.getCurrentTrackName);

  const discardingInfo = useGameStateStore((state) => state.discardingInfo);
  const localPlayerName = usePlayerStore((state) => state.name);
  const localPlayerId = useMemo(() => players.find(p => p.name === localPlayerName)?.id, [players, localPlayerName]);
  
  const isDiscardingMe = useMemo(() => 
    discardingInfo !== null && localPlayerId !== undefined && discardingInfo.playerId === localPlayerId,
  [discardingInfo, localPlayerId]);

  const discardRequired = isDiscardingMe ? (discardingInfo?.amount || 0) : 0;
  
  const [discardSelection, setDiscardSelection] = useState<Record<string, number>>({});

  const mapDomainPlayerToPlayerBoardProps = useCallback((player: any, isActive: boolean, isCurrentPlayer: boolean) => {
    const tokens: Record<TokenResourceType, number> = {
      RADIANT_GEM: player.resources.radiant_gem || 0,
      ARCANE_CRYSTAL: player.resources.arcane_crystal || 0,
      NATURES_BLESSING: player.resources.natures_blessing || 0,
      INFERNAL_IRON: player.resources.infernal_iron || 0,
      DARK_QUARTZ: player.resources.dark_quartz || 0,
      TRUE_SOUL_TADPOLE: player.resources.true_soul_tadpole || 0,
    };

    const mapCardForPlayer = (card: DomainCard): CardProps => {
      const isAffordable = canAffordCard(player, card);
      return {
        id: card.id, assetId: card.assetId || '', name: card.name, tier: card.tier as 1 | 2 | 3, prestigePoints: card.points,
        providedBonus: card.bonus.toUpperCase() as TokenResourceType,
        cost: Object.entries(card.cost).reduce((acc, [type, amount]) => {
          acc[type.toUpperCase() as TokenResourceType] = amount; return acc;
        }, {} as Record<TokenResourceType, number>),
        isAffordable, isSelected: false, description: card.description,
      };
    };

    return {
      playerName: player.name, prestigePoints: player.prestigePoints, tokens,
      ownedCards: player.acquiredCards.map(mapCardForPlayer),
      reservedCards: player.reservedCards.map(mapCardForPlayer),
      patrons: player.patrons.map((p: any) => ({ id: p.id, assetId: p.assetId, prestigePoints: p.points })),
      isActive, isCurrentPlayer, isLocalPlayer: isCurrentPlayer,
    };
  }, []);

  const mappedPlayers = useMemo(() => {
    return players.map((p, index) => 
      mapDomainPlayerToPlayerBoardProps(p, index === currentPlayerIndex, p.name === localPlayerName)    );
  }, [players, currentPlayerIndex, localPlayerName, mapDomainPlayerToPlayerBoardProps]);

  const currentPlayerProp = mappedPlayers.find(p => p.isCurrentPlayer) || mappedPlayers[currentPlayerIndex] || mappedPlayers[0];
  const opponentsProps = mappedPlayers.filter(p => p.playerName !== currentPlayerProp.playerName);

  const isMyTurn = players[currentPlayerIndex]?.name === localPlayerName;
  const { selectedTokens, tokenOrigins, selectToken, deselectToken, clearSelection, isValid: isTakeValid } = useTokenSelection(availableResources as any);

  // --- MULTIPLAYER HEARTBEAT ---
  useEffect(() => {
    console.log(`[HEARTBEAT] Init for ${localPlayerName}, host is ${players[0]?.name}`);
    const heartbeatInterval = setInterval(() => {
      // The first player (Host) is responsible for periodic sync to catch dropped packets
      if (players[0]?.name === localPlayerName) {
        console.log('[HEARTBEAT] Triggering sync broadcast');
        window.dispatchEvent(new CustomEvent('request-sync-broadcast'));
      }
    }, 5000);
    return () => clearInterval(heartbeatInterval);
  }, [players, localPlayerName]);

  const { handleConfirmTokens, handleCardInteract, handleDiscardTokens } = usePlayerActions({
    playerName: currentPlayerProp.playerName, selectedTokens: selectedTokens as Record<string, number>, clearSelection,
  });

  const handleTokenClick = useCallback((type: TokenResourceType, x: number, y: number) => {
    if (!isMyTurn || isDiscardingMe) return;
    selectToken(type.toLowerCase() as DomainResourceType, x, y);
  }, [selectToken, isMyTurn, isDiscardingMe]);

  const handlePlayerTokenClick = useCallback((type: TokenResourceType) => {
      if (!isDiscardingMe) return;
      const totalDiscarded = Object.values(discardSelection).reduce((s, c) => s + c, 0);
      if (totalDiscarded >= discardRequired) return; // Prevent selecting more than required

      const domainType = type.toLowerCase();
      const currentInBoard = players[currentPlayerIndex].resources[domainType as DomainResourceType] || 0;
      const currentInDiscard = discardSelection[domainType] || 0;
      if (currentInBoard > currentInDiscard) {
          setDiscardSelection(prev => ({ ...prev, [domainType]: (prev[domainType] || 0) + 1 }));
      }
  }, [discardRequired, discardSelection, players, currentPlayerIndex, isDiscardingMe]);

  const handleRemoveDiscardToken = useCallback((type: TokenResourceType) => {
      const domainType = type.toLowerCase();
      setDiscardSelection(prev => ({ ...prev, [domainType]: Math.max(0, (prev[domainType] || 0) - 1) }));
  }, []);

  const handleConfirmDiscardWithAnimation = useCallback(() => {
      const playerBoardEl = document.querySelector(`#player-board-${players[currentPlayerIndex].name.replace(/\s+/g, '-')}`);
      if (playerBoardEl) {
          const rect = playerBoardEl.getBoundingClientRect();
          Object.entries(discardSelection).forEach(([type, count]) => {
              if (count && count > 0) {
                  triggerTokenTransfer({
                      tokens: { [type.toUpperCase() as any]: count },
                      startX: rect.left + rect.width / 2, startY: rect.top + rect.height / 2,
                      targetSelector: '.public-resource-pool'
                  });
              }
          });
      }
      handleDiscardTokens(discardSelection);
      setDiscardSelection({});
  }, [handleDiscardTokens, discardSelection, players, currentPlayerIndex]);

  const handleConfirmTokensWithAnimation = useCallback(() => {
    Object.entries(selectedTokens).forEach(([type, count]) => {
      if (count && count > 0) {
        const domainType = type as DomainResourceType;
        const origin = tokenOrigins[domainType];
        triggerTokenTransfer({
          tokens: { [type.toUpperCase() as any]: count },
          startX: origin?.x ?? window.innerWidth / 2, startY: origin?.y ?? window.innerHeight / 2,
          targetSelector: `#player-board-${players[currentPlayerIndex].name.replace(/\s+/g, '-')}`
        });
      }
    });
    handleConfirmTokens();
  }, [selectedTokens, tokenOrigins, players, currentPlayerIndex, handleConfirmTokens]);

  const handleCardInteractWithModal = (action: 'buy' | 'reserve' | 'select', cardId: string) => {
    if (action !== 'select' && !isMyTurn) return;
    if (action === 'select') setDetailedCardId(cardId);
    else { handleCardInteract(action, cardId); setDetailedCardId(null); }
  };

  const currentPlayerStore = players[currentPlayerIndex];
  const playerState = useMemo(() => currentPlayerStore, [currentPlayerStore]);

  const detailedCardProps = useMemo(() => {
    if (!detailedCardId) return null;
    const allCards = [...(faceUpCards[CardTier.TIER_1] || []), ...(faceUpCards[CardTier.TIER_2] || []), ...(faceUpCards[CardTier.TIER_3] || []), ...currentPlayerStore.reservedCards];
    const card = allCards.find(c => c.id === detailedCardId);
    if (!card) return null;
    const isAffordable = canAffordCard(playerState, card);
    const missingResources = calculateMissingResources(playerState, card);
    const cost: Partial<Record<TokenResourceType, number>> = {};
    for (const [type, amount] of Object.entries(card.cost)) cost[type.toUpperCase() as TokenResourceType] = amount;
    return {
      id: card.id, assetId: card.assetId || '', name: card.name, tier: card.tier as 1 | 2 | 3, prestigePoints: card.points, providedBonus: card.bonus.toUpperCase() as TokenResourceType,
      cost, isAffordable, missingResources: missingResources as any, isSelected: false, description: card.description,
    };
  }, [detailedCardId, playerState, faceUpCards, currentPlayerStore.reservedCards]);

  const detailedPatronProps = useMemo(() => {
    if (!detailedPatronId) return null;
    const patron = availablePatrons.find(p => p.id === detailedPatronId);
    if (!patron) return null;
    const localizedName = language === 'ZH' ? (ZH.card_names as any)[patron.name] || patron.name : patron.name;
    const localizedDescription = language === 'ZH' ? (ZH.card_descriptions as any)[patron.description || ''] || patron.description : patron.description;
    const imageUrl = AssetRepository.getArt(patron.assetId || '');
    return { id: patron.id, name: localizedName, description: localizedDescription, imageUrl, points: patron.points, requirements: patron.requirements };
  }, [detailedPatronId, availablePatrons, language]);

  const stagingTokens = useMemo(() => Object.entries(selectedTokens).reduce((acc, [key, value]) => { acc[key.toUpperCase() as TokenResourceType] = value; return acc; }, {} as Record<TokenResourceType, number>), [selectedTokens]);
  const discardStagingTokens = useMemo(() => Object.entries(discardSelection).reduce((acc, [key, value]) => { acc[key.toUpperCase() as TokenResourceType] = value; return acc; }, {} as Record<TokenResourceType, number>), [discardSelection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearSelection();
      else if (e.key === 'Enter') {
        if (discardRequired > 0) {
            const totalDiscarded = Object.values(discardSelection).reduce((s, c) => s + c, 0);
            if (totalDiscarded === discardRequired) handleConfirmDiscardWithAnimation();
        } else if (isTakeValid) handleConfirmTokensWithAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, isTakeValid, handleConfirmTokensWithAnimation, discardRequired, discardSelection, handleConfirmDiscardWithAnimation]);

  const winners = useMemo(() => phase === GamePhase.COMPLETED ? getWinners({ players } as any) : [], [phase, players]);

  return (
    <main 
      className="flex flex-col gap-4 p-4 h-screen box-border relative overflow-hidden bg-[var(--color-bg-underdark)] bg-gradient-to-b from-[var(--color-bg-underdark)] to-[var(--color-bg-underdark-end)] text-[var(--color-text-primary)] select-none"
      style={{ cursor: `url('${AssetRepository.getCursor()}'), auto` }}
    >
      <NotificationOverlay />
      <TokenTransfer />
      <CardFlight />
      <PatronFlight />
      <DevToolsPanel />
      {/* Dynamic Victory Sequence */}
      {phase === GamePhase.COMPLETED && <VictoryVFX winners={winners} onReset={reset} />}

      <Modal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} title={t.rules} variant="parchment">
        {language === 'ZH' ? rulesContentZH : rulesContentEN}
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t.audioSettings} variant="default">
        <div className="flex flex-col gap-8 px-2 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] border-b border-[var(--color-ui-border-tier1)]/30 pb-2">{t.bgm}</h3>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--color-gold)] w-8 text-right">{Math.round(bgmVolume * 100)}%</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={bgmVolume} 
                onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                className="flex-1 accent-[var(--color-gold)] cursor-pointer h-1.5 bg-black/50 rounded-full appearance-none"
              />
            </div>

            {/* Music Player Dashboard */}
            <div className="bg-black/40 border border-[var(--color-ui-border-tier1)]/30 rounded-md p-4 flex flex-col items-center gap-3">
              {/* Song Name with Glow */}
              <div className="text-center w-full">
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Now Playing / 正在播放</p>
                <p className="text-sm font-fantasy font-bold text-[#E8E2D2] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] truncate mt-1">
                  {getCurrentTrackName()}
                </p>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-4 mt-1">
                {/* Shuffle Button */}
                <button
                  onClick={() => setShuffle(!isShuffle)}
                  className={`p-2 rounded border border-[var(--color-gold-dark)]/40 hover:bg-[var(--color-gold-dark)]/20 transition-all ${isShuffle ? 'bg-[var(--color-gold-dark)]/30 text-[var(--color-gold)] shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'bg-black/30 text-gray-500'}`}
                  title="Shuffle Playlist / 随机播放"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l5 5m1.5 1.5L14 14m.5.5L20 20M20 4l-5 5m-1.5 1.5L9 14m-1.5 1.5L4 20" />
                  </svg>
                </button>

                {/* Prev Button */}
                <button
                  onClick={prevBgm}
                  className="p-2 rounded border border-[var(--color-gold-dark)]/40 bg-black/30 text-[var(--color-gold)] hover:bg-[var(--color-gold-dark)]/20 transition-all active:scale-95"
                  title="Previous Song / 上一首"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={isBgmPlaying ? pauseBgm : playBgm}
                  className="p-3 rounded-full border-2 border-[var(--color-gold)] bg-gradient-to-b from-[#bf953f] to-[#aa7c11] text-black hover:brightness-110 hover:shadow-[0_0_12px_rgba(212,175,55,0.6)] transition-all active:scale-95 flex items-center justify-center w-10 h-10"
                  title={isBgmPlaying ? "Pause / 暂停" : "Play / 播放"}
                >
                  {isBgmPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Next Button */}
                <button
                  onClick={nextBgm}
                  className="p-2 rounded border border-[var(--color-gold-dark)]/40 bg-black/30 text-[var(--color-gold)] hover:bg-[var(--color-gold-dark)]/20 transition-all active:scale-95"
                  title="Next Song / 下一首"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] border-b border-[var(--color-ui-border-tier1)]/30 pb-2">{t.sfx}</h3>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--color-gold)] w-8 text-right">{Math.round(globalVolume * 100)}%</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={globalVolume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-[var(--color-gold)] cursor-pointer h-1.5 bg-black/50 rounded-full appearance-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] border-b border-[var(--color-ui-border-tier1)]/30 pb-2">System</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => console.error(err));
                  } else {
                    document.exitFullscreen();
                  }
                }}
                className="py-3 bg-black/40 border border-[var(--color-gold-dark)]/40 rounded text-xs text-[var(--color-gold)] font-fantasy uppercase tracking-wider hover:bg-[var(--color-gold-dark)]/20 transition-all shadow-inner"
              >
                {document.fullscreenElement ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              </button>

              <button 
                onClick={() => {
                  const url = new URL(window.location.href);
                  if (url.searchParams.has('debug')) {
                    url.searchParams.delete('debug');
                  } else {
                    url.searchParams.set('debug', 'true');
                  }
                  window.location.href = url.toString();
                }}
                className="py-3 bg-black/40 border border-[var(--color-gold-dark)]/40 rounded text-xs text-[var(--color-gold)] font-fantasy uppercase tracking-wider hover:bg-[var(--color-gold-dark)]/20 transition-all shadow-inner"
              >
                Toggle Observability
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!detailedCardId} onClose={() => setDetailedCardId(null)} title="" variant="clean">
        {detailedCardProps && (
          <div className="scale-105 origin-top">
             <Card {...detailedCardProps} isDetailed onClose={() => setDetailedCardId(null)} onInteract={handleCardInteractWithModal} />
          </div>
        )}
      </Modal>

      <Modal isOpen={!!detailedPatronId} onClose={() => setDetailedPatronId(null)} title="" variant="clean">
        {detailedPatronProps && (
          <div className="scale-105 origin-top">
            <div 
              className="group bg-[var(--color-ui-bg-panel)] border-[4px] rounded-xl border-[var(--color-bg-panel-alt)] shadow-[inset_0_0_25px_rgba(168,85,247,0.2)] overflow-visible shadow-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] w-[420px] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
            >
              <div className="absolute top-0 left-0 w-10 h-10 border-t-[6px] border-l-[6px] border-[var(--color-ui-border-tier1)] opacity-80 z-30 rounded-tl-lg pointer-events-none shadow-[inset_4px_4px_10px_rgba(168,85,247,0.2)]" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-[6px] border-r-[6px] border-[var(--color-ui-border-tier1)] opacity-80 z-30 rounded-tr-lg pointer-events-none shadow-[inset_-4px_4px_10px_rgba(168,85,247,0.2)]" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[6px] border-l-[6px] border-[var(--color-ui-border-tier1)] opacity-80 z-30 rounded-bl-lg pointer-events-none shadow-[inset_4px_-4px_10px_rgba(168,85,247,0.2)]" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[6px] border-r-[6px] border-[var(--color-ui-border-tier1)] opacity-80 z-30 rounded-br-lg pointer-events-none shadow-[inset_-4px_-4px_10px_rgba(168,85,247,0.2)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05)_0%,transparent_80%)] pointer-events-none z-20 mix-blend-screen" />

              <button 
                className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-[var(--color-bg-obsidian)] border-2 border-[var(--color-ui-border-tier1)] text-[var(--color-text-primary)] flex items-center justify-center hover:bg-[var(--color-bg-panel-alt)] hover:text-white hover:border-[var(--color-text-primary)] hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all z-[100] shadow-2xl text-2xl font-bold cursor-pointer"
                onClick={() => setDetailedPatronId(null)}
                aria-label="Close detail"
              >
                ×
              </button>

              <div 
                className="w-full flex flex-col relative overflow-hidden rounded-md flex-1 pb-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 20%, rgba(60, 40, 90, 0.4) 0%, transparent 60%), linear-gradient(to bottom, rgba(15, 10, 20, 0.9), rgba(5, 2, 10, 0.98)), url(${AssetRepository.getParchmentTexture()})`,
                  backgroundSize: '100% 100%, cover, cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'screen, multiply, normal'
                }}
              >
                <div className="flex justify-between items-start p-4 z-20 relative">
                  <div className="w-10 h-10"></div> {/* Empty space to balance badge */}
                  {detailedPatronProps.points > 0 && (
                    <div className="relative group/badge">
                       <div className="absolute inset-0 bg-purple-600/30 blur-xl mix-blend-screen animate-pulse rounded-full" />
                       <PrestigeBadge prestigePoints={detailedPatronProps.points} size="lg" className="shadow-[0_0_30px_rgba(168,85,247,0.4)] relative z-10 scale-110 grayscale-[30%] hue-rotate-[-30deg]" />
                    </div>
                  )}
                </div>

                <div className="relative w-[360px] h-[360px] mx-auto mt-0 mb-4 group/patron-img">
                  <div className="absolute inset-0 bg-purple-900/20 blur-2xl rounded-full mix-blend-screen animate-pulse" />
                  <div className="bg-bg-obsidian w-full h-full overflow-hidden rounded-lg border-[4px] border-[var(--color-bg-panel-alt)] shadow-[0_0_50px_rgba(168,85,247,0.2),inset_0_0_60px_rgba(0,0,0,1)] flex items-center justify-center relative z-10 transition-transform duration-1000 ease-out group-hover/patron-img:scale-[1.02]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none mix-blend-screen z-20" />
                    {detailedPatronProps.imageUrl ? (
                      <img src={detailedPatronProps.imageUrl} alt={detailedPatronProps.name} className="w-full h-full object-cover transition-transform duration-[10s] ease-out hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-[var(--color-bg-underdark)] flex items-center justify-center text-[var(--color-parchment)] font-fantasy">Patron</div>
                    )}
                  </div>
                </div>

                <div className="px-6 flex-1 flex flex-col justify-start mt-2 bg-gradient-to-t from-black via-[var(--color-bg-underdark-end)] to-transparent py-4 min-h-[140px] relative z-20">
                  <div className="flex flex-wrap justify-center gap-6 mb-6">
                    {Object.entries(detailedPatronProps.requirements).map(([resource, amount]) => {
                      if (amount && amount > 0) {
                        return (
                          <div key={resource} className="relative flex items-center justify-center scale-125 hover:scale-150 transition-transform duration-300">
                            <UnifiedToken type={resource.toUpperCase() as any} size="md" className="shadow-[0_0_20px_rgba(168,85,247,0.3)]" />
                            <div className="absolute -bottom-1 -right-1 bg-[var(--color-bg-underdark-end)] border-[2px] border-[var(--color-ui-border-tier1)] rounded-full w-6 h-6 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)] z-10">
                              <span className="font-fantasy text-[var(--color-text-primary)] font-bold text-xs drop-shadow-md">{amount}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {detailedPatronProps.description && (
                    <div className="px-6 py-5 bg-[var(--color-bg-underdark-end)]/90 border-l-[4px] border-[var(--color-ui-border-tier1)] italic text-[var(--color-text-primary)] font-serif text-center leading-relaxed text-sm mb-4 rounded-r-lg mx-2 shadow-[0_4px_25px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(168,85,247,0.05)] tracking-wide">
                      "{detailedPatronProps.description}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <h1 className="sr-only">Splendor Game Arena</h1>
      <TurnAnnouncer />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-[40]"></div>

      <div className="grid grid-cols-1 gap-4 flex-grow min-h-0" style={{ gridTemplateColumns: `${GAME_CONFIG.UI.SIDEBAR_WIDTH_FULL}px 1fr 360px` }}>
        <div className="flex flex-col gap-4 items-stretch w-full pl-2 pt-2 min-w-[280px] overflow-y-auto">
          <PlayerBoard {...currentPlayerProp} onReservedCardInteract={handleCardInteractWithModal} interactiveTokens={discardRequired > 0 && isMyTurn} onTokenClick={handlePlayerTokenClick} />
          {opponentsProps.map((opponent, index) => (
            <PlayerBoard key={index} {...opponent} viewMode={opponent.playerName === expandedPlayerName ? 'full' : 'summary'} onClick={() => setExpandedPlayerName(opponent.playerName === expandedPlayerName ? null : opponent.playerName)} onReservedCardInteract={handleCardInteractWithModal} interactiveTokens={false} />
          ))}
        </div>

        <div className="flex flex-col flex-grow min-h-0 relative overflow-hidden items-center justify-center">
          <div className="w-full"><CardMarket onCardInteract={handleCardInteractWithModal} /></div>
        </div>

        <div className="flex flex-col gap-4 p-4 rounded-lg border border-[var(--color-ui-border-tier1)] bg-[var(--color-bg-underdark)] shadow-[inset_0_0_30px_rgba(0,0,0,0.9),inset_0_0_10px_rgba(0,0,0,0.8),0_8px_16px_rgba(0,0,0,0.6)] overflow-y-auto items-center min-w-[320px] relative z-50">
          
          <TopRightHUD onOpenSettings={() => setIsSettingsOpen(true)} />

          <div className="bg-[var(--color-bg-panel-alt)] border border-[var(--color-gold-dark)]/60 rounded-xl px-2 py-2 shadow-lg flex flex-col items-center gap-2 w-full max-w-60 mt-2">
            <div className="flex flex-col items-center w-full">
              <div className="flex justify-between w-full px-2 mb-1 font-fantasy">
                <span className="text-sm text-[var(--color-parchment)] font-bold uppercase tracking-widest drop-shadow-md">{t.turn} {turnNumber}</span>
                <span className="text-sm text-[var(--color-parchment)] font-bold uppercase tracking-widest drop-shadow-md">{t.time}: 45s</span>
              </div>
              <div className="w-full h-2 bg-[var(--color-ui-bg-vault)] rounded-full border border-[var(--color-gold-dark)] relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[var(--color-bg-underdark-end)] to-[var(--color-ui-bg-vault)]">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold/60 via-gold to-[var(--color-gold-light)] w-3/4 shadow-[0_0_10px_var(--color-gold)]"></div>
              </div>
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button className="flex-1 px-3 py-1 bg-gradient-to-b from-[var(--color-ui-plot-start)] to-[var(--color-ui-plot-end)] border border-[var(--color-gold-dark)]/60 rounded text-xs text-[var(--color-parchment)] font-fantasy uppercase tracking-wider hover:brightness-125 transition-all shadow-md" onClick={() => setIsRulesOpen(true)}>📜 {t.rules}</button>
              <button className="flex-1 px-3 py-1 bg-[var(--color-bg-card)] border border-[var(--color-gold-dark)]/60 rounded text-xs text-gold/80 hover:bg-red-900/40 hover:text-white transition-colors" onClick={() => { if (confirm(t.resetConfirmation)) { reset(); clearSelection(); useGameStateStore.getState().setDiscardingInfo(null); setDiscardSelection({}); } }}>{t.reset}</button>
            </div>
          </div>

          <div className="w-full flex flex-col items-center mt-2">
            <h3 className="text-[var(--color-parchment)] font-fantasy mb-2 border-b-2 border-[var(--color-gold-dark)]/40 pb-1 w-full text-center text-base uppercase tracking-widest drop-shadow-lg font-bold">{t.patrons}</h3>
            <div className="grid grid-cols-3 gap-2 w-full justify-items-center px-1">
              {availablePatrons.map((patron) => (
                <div key={patron.id} className="scale-[0.85] origin-top"><PatronSlot patron={patron} onClick={(p) => setDetailedPatronId(p.id)} /></div>
              ))}
            </div>
          </div>
          
          <StagingArea 
            tokens={discardRequired > 0 ? discardStagingTokens : stagingTokens} 
            onConfirm={discardRequired > 0 ? handleConfirmDiscardWithAnimation : handleConfirmTokensWithAnimation} 
            onCancel={discardRequired > 0 ? () => {} : clearSelection} 
            onRemoveToken={discardRequired > 0 ? handleRemoveDiscardToken : (type) => deselectToken(type.toLowerCase() as DomainResourceType)}
            isValid={discardRequired > 0 ? (Object.values(discardSelection).reduce((s, c) => s + c, 0) === discardRequired) : isTakeValid}
            mode={discardRequired > 0 ? 'discard' : 'take'}
            discardRequired={discardRequired}
          />

          <div className="mt-auto w-full">
             <PublicResourcePool onTokenClick={handleTokenClick} disabledTokens={Object.keys(selectedTokens) as any} />
          </div>
        </div>
      </div>
    </main>
  );
};

const rulesContentEN = (
  <div className="text-[var(--color-ui-text-parchment)] font-serif space-y-6 animate-fade-in">
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">{EN.objective}</h4>
      <p className="leading-relaxed text-base italic">{EN.ruleQuote}</p>
      <p className="leading-relaxed mt-2 text-sm">Race against other players to reach <span className="font-bold text-red-900 underline decoration-[var(--color-gold-dark)]">18 Prestige Points</span>. The gold number in the <span className="italic font-bold text-amber-900">top right corner</span> of a card indicates its value.</p>
    </section>
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">Resources & Recruitment</h4>
      <div className="space-y-4">
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/60 p-3 rounded border border-[var(--color-ui-border-tier1)]/20">
          <span className="text-amber-900 font-bold block mb-1">💎 Consumable Tokens</span>
          <p className="text-xs leading-relaxed text-[var(--color-ui-border-tier1)]">Collected from the bank. These are <span className="font-bold">discarded</span> after you use them to pay for a card.</p>
        </div>
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/60 p-3 rounded border border-[var(--color-ui-border-tier1)]/20">
          <span className="text-emerald-900 font-bold block mb-1">✨ Permanent Bonuses</span>
          <p className="text-xs leading-relaxed text-[var(--color-ui-border-tier1)]">Every card you recruit grants a <span className="font-bold">permanent resource discount</span> (shown in the top left). These never disappear and can be reused every turn to lower the cost of future allies.</p>
        </div>
      </div>
    </section>
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">{EN.yourTurn}</h4>
      <div className="space-y-3">
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/40 p-3 border-l-4 border-emerald-800 rounded-r shadow-sm">
          <span className="text-emerald-900 font-bold block mb-1">🏺 {EN.scavenge}</span>
          <p className="text-xs">Take 3 gems of different colors, or 2 gems of the same color (if the stack has 4+ remaining).</p>
        </div>
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/40 p-3 border-l-4 border-amber-800 rounded-r shadow-sm">
          <span className="text-amber-900 font-bold block mb-1">📜 {EN.recruit}</span>
          <p className="text-xs">Spend your gems to add a character to your board. Their cost is reduced by your existing Permanent Bonuses.</p>
        </div>
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/40 p-3 border-l-4 border-blue-800 rounded-r shadow-sm">
          <span className="text-blue-900 font-bold block mb-1">👁️ {EN.plot} (Reserve)</span>
          <p className="text-xs">Take a card into your private hand. <span className="font-bold">Only you</span> can recruit it later. Gain 1 <span className="text-purple-900 italic font-bold">Wildcard Tadpole</span>. Max 3 plots.</p>
        </div>
      </div>
    </section>
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">Patrons</h4>
      <p className="leading-relaxed text-sm">At turn's end, gods and factions (Patrons) monitor your strength. If you meet their criteria (Permanent Bonuses), they visit automatically, granting significant Prestige. Only one Patron can visit per turn.</p>
    </section>
    <div className="mt-6 pt-4 border-t border-[var(--color-ui-border-tier1)]/20 text-center">
      <p className="text-xs italic text-[var(--color-ui-border-tier1)]/80">{EN.elminsterQuote}</p>
    </div>
  </div>
);

const rulesContentZH = (
  <div className="text-[var(--color-ui-text-parchment)] font-serif space-y-6 animate-fade-in">
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">{ZH.objective}</h4>
      <p className="leading-relaxed text-base italic">{ZH.ruleQuote}</p>
      <p className="leading-relaxed mt-2 text-sm">与其他玩家竞争，率先达到 <span className="font-bold text-red-900 underline decoration-[var(--color-gold-dark)]">18 点声望值</span>。卡牌<span className="italic font-bold text-amber-900">右上角的金色数字</span>代表其价值。</p>
    </section>
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">资源与招募</h4>
      <div className="space-y-4">
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/60 p-3 rounded border border-[var(--color-ui-border-tier1)]/20">
          <span className="text-amber-900 font-bold block mb-1">💎 一次性代币</span>
          <p className="text-xs leading-relaxed text-[var(--color-ui-border-tier1)]">从公共库获取。在招募角色时作为货币支付，支付后<span className="font-bold">消失</span>并回流到库中。</p>
        </div>
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/60 p-3 rounded border border-[var(--color-ui-border-tier1)]/20">
          <span className="text-emerald-900 font-bold block mb-1">✨ 永久资源加成</span>
          <p className="text-xs leading-relaxed text-[var(--color-ui-border-tier1)]">每当你招募一名角色，卡片左上角的图标就变为你的<span className="font-bold">永久折扣</span>。它们永远不会消失，可以每回合重复使用，减少未来招募所需的代币。</p>
        </div>
      </div>
    </section>
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">{ZH.yourTurn}</h4>
      <div className="space-y-3">
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/40 p-3 border-l-4 border-emerald-800 rounded-r shadow-sm">
          <span className="text-emerald-900 font-bold block mb-1">🏺 {ZH.scavenge}</span>
          <p className="text-xs">拿取 3 个不同颜色的宝石，或拿取 2 个相同颜色的宝石（前提是该堆宝石剩余不少于 4 个）。</p>
        </div>
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/40 p-3 border-l-4 border-amber-800 rounded-r shadow-sm">
          <span className="text-amber-900 font-bold block mb-1">📜 {ZH.recruit}</span>
          <p className="text-xs">消耗宝石代币招募角色。如果拥有对应的永久加成，招募成本将直接降低。</p>
        </div>
        <div className="bg-[var(--color-ui-bg-parchment-dark)]/40 p-3 border-l-4 border-blue-800 rounded-r shadow-sm">
          <span className="text-blue-900 font-bold block mb-1">👁️ {ZH.plot} (预留)</span>
          <p className="text-xs">将卡牌收入私有手牌。<span className="font-bold">从此只有你能招募它</span>。同时获得一个<span className="text-purple-900 italic font-bold">夺心魔蝌蚪</span> (万能资源)。上限3张。</p>
        </div>
      </div>
    </section>
    <section>
      <h4 className="text-[var(--color-text-dark)] font-fantasy text-xl border-b-2 border-[var(--color-ui-border-tier1)]/30 mb-3 uppercase tracking-wider font-bold">神祇眷顾</h4>
      <p className="leading-relaxed text-sm">回合结束时，如果你满足了神祇或势力（贵族）的招募要求（永久加成数量），他们会自动造访并授予你丰厚的声望奖励。</p>
    </section>
    <div className="mt-6 pt-4 border-t border-[var(--color-ui-border-tier1)]/20 text-center">
      <p className="text-xs italic text-[var(--color-ui-border-tier1)]/80">{ZH.elminsterQuote}</p>
    </div>
  </div>
);
