import { useCallback } from 'react';
import { useEventLogStore } from '../store/eventLogStore';
import { useGameStateStore, broadcastAnimationEvent } from '../store/gameStateStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAudioStore } from '../store/audioStore';
import { getTotalResourceCount } from '../domain/logic';
import { CardTier, ResourceType } from '../domain/models';

export function usePlayerActions({
  selectedTokens,
  clearSelection,
  onCardInteractProp
}: {
  playerName: string;
  selectedTokens: Record<string, number>;
  clearSelection: () => void;
  onCardInteractProp?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}) {
  const notify = useNotificationStore((state) => state.notify);
  
  const addLog = (player: string, action: string, target?: string, details?: string) => {
      const message = JSON.stringify({ player, action, target, details });
      useEventLogStore.getState().addEvent(message);
  };

  const handleTurnTransition = (delayMs: number) => {
    setTimeout(() => {
      const state = useGameStateStore.getState();
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      // Dispatch END_TURN action (will be synced)
      useGameStateStore.getState().dispatchAction({ type: 'END_TURN', payload: { playerId: currentPlayer.id } });
      
      const nextState = useGameStateStore.getState();
      const nextPlayerName = nextState.players[nextState.currentPlayerIndex].name;
      const language = nextState.language;
      
      const announcementText = language === 'ZH' ? `${nextPlayerName} 的回合` : `${nextPlayerName}'s Turn`;
      const detail = { text: announcementText, type: 'start' };
      useAudioStore.getState().playAudio('turn_start');
      window.dispatchEvent(new CustomEvent('announce-turn', { detail }));
      broadcastAnimationEvent('announce-turn', detail);
      
      setTimeout(() => {
        useGameStateStore.getState().setAnimationLocked(false);
      }, 2800); // 2.5s transition + small buffer
    }, delayMs);
  };

  const handleConfirmTokens = useCallback(() => {
    const startTime = performance.now();
    const state = useGameStateStore.getState();
    if (state.isAnimationLocked) return;
    const currentPlayer = state.players[state.currentPlayerIndex];
    const tokens: Record<string, number> = {};
    for (const [type, amount] of Object.entries(selectedTokens)) {
      if (amount && amount > 0) tokens[type] = amount;
    }

    // 1. Dispatch Local Action
    useGameStateStore.getState().dispatchAction({ type: 'TAKE_TOKENS', payload: { playerId: currentPlayer.id, tokens } });
    
    // 2. Check consequences
    const updatedState = useGameStateStore.getState();
    const updatedPlayer = updatedState.players[state.currentPlayerIndex];
    const totalCount = getTotalResourceCount(updatedPlayer);

    const duration = performance.now() - startTime;
    import('../components/debug/PerformanceMonitor').then(m => m.logMetric('Take Tokens', duration));
    useAudioStore.getState().playAudio('token_drop');
    addLog(currentPlayer.name, 'take', '', Object.keys(tokens).join(', '));
    
    if (totalCount > 10) {
        useGameStateStore.getState().setDiscardingInfo({ playerId: currentPlayer.id, amount: totalCount - 10 });
        clearSelection();
        notify(state.language === 'ZH' ? '你需要弃置多余代币' : 'You must discard excess tokens', 'warning');
    } else {
        useGameStateStore.getState().setAnimationLocked(true);
        handleTurnTransition(1500);
        clearSelection();
    }
  }, [selectedTokens, clearSelection, handleTurnTransition, notify]);

  const handleDiscardTokens = useCallback((tokensToDiscard: Record<string, number>) => {
      const state = useGameStateStore.getState();
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      useGameStateStore.getState().dispatchAction({ type: 'DISCARD_TOKENS', payload: { playerId: currentPlayer.id, tokens: tokensToDiscard } });
      
      const updatedState = useGameStateStore.getState();
      useGameStateStore.getState().setDiscardingInfo(null);
      useAudioStore.getState().playAudio('token_drop');
      addLog(currentPlayer.name, 'discard', '', Object.keys(tokensToDiscard).join(', '));
      const updatedPlayer = updatedState.players[state.currentPlayerIndex];
      const totalCount = getTotalResourceCount(updatedPlayer);
      if (totalCount <= 10) {
          useGameStateStore.getState().setAnimationLocked(true);
          handleTurnTransition(800);
          notify(state.language === 'ZH' ? '代币已弃置' : 'Tokens discarded', 'success');
      }
  }, [handleTurnTransition, notify]);

  const handleCardInteract = useCallback((action: 'buy' | 'reserve' | 'select', cardId: string) => {
    const state = useGameStateStore.getState();
    if (state.isAnimationLocked) return;
    const currentPlayer = state.players[state.currentPlayerIndex];
    
    const allCards = [
      ...state.faceUpCards[CardTier.TIER_1],
      ...state.faceUpCards[CardTier.TIER_2],
      ...state.faceUpCards[CardTier.TIER_3],
      ...currentPlayer.reservedCards
    ];
    const card = allCards.find(c => c?.id === cardId);
    if (!card && !cardId.startsWith('TIER_') && action !== 'select') return;

    let cardX = window.innerWidth / 2;
    let cardY = window.innerHeight / 2;
    const cardElement = document.getElementById(`card-${cardId}`);
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      cardX = rect.left + rect.width / 2;
      cardY = rect.top + rect.height / 2;
    }

    const getPlayerTarget = () => {
      const el = document.querySelector(`#player-board-${currentPlayer.name.replace(/\s+/g, '-')}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return { x: 150, y: window.innerHeight / 2 };
    };

    if (action === 'reserve') {
      const fromDeck = cardId.startsWith('TIER_') ? parseInt(cardId.replace('TIER_', '')) as CardTier : undefined;
      
      useGameStateStore.getState().dispatchAction({ 
        type: 'RESERVE_CARD', 
        payload: { playerId: currentPlayer.id, cardId: fromDeck ? undefined : cardId, fromDeck } 
      });

      const updatedState = useGameStateStore.getState();
      const updatedPlayer = updatedState.players.find(p => p.id === currentPlayer.id);
      
      useAudioStore.getState().playAudio('card_reserve');
      addLog(currentPlayer.name, 'reserve', card?.name || 'Deck');
      useGameStateStore.getState().setAnimationLocked(true);
      const target = getPlayerTarget();
      const reservedCard = card || (updatedPlayer ? updatedPlayer.reservedCards[updatedPlayer.reservedCards.length - 1] : null);

      if ((state.availableResources[ResourceType.TRUE_SOUL_TADPOLE] || 0) > 0) {
           import('../components/common/TokenTransfer').then(({ triggerTokenTransfer }) => {
            triggerTokenTransfer({
              tokens: { [ResourceType.TRUE_SOUL_TADPOLE as string]: 1 } as any,
              startX: window.innerWidth - 100, startY: window.innerHeight / 2,
              targetX: cardX, targetY: cardY,
            });
          });
      }

      if (reservedCard) {
          setTimeout(() => {
            import('../components/common/CardFlight').then(({ spawnCardFlight }) => {
              spawnCardFlight(reservedCard, cardX, cardY, target.x, target.y, 'animate-arcane-reserve');
            });
          }, 800);
      }

      const totalCount = getTotalResourceCount(updatedPlayer!);
      if (totalCount > 10) {
          useGameStateStore.getState().setAnimationLocked(false);
          useGameStateStore.getState().setDiscardingInfo({ playerId: currentPlayer.id, amount: totalCount - 10 });
          notify(state.language === 'ZH' ? '你需要弃置多余代币' : 'You must discard excess tokens', 'warning');
      } else {
          handleTurnTransition(2000);
      }
    } else if (action === 'buy') {
      if (!card) return;
      const isFromReserved = currentPlayer.reservedCards.some(c => c.id === cardId);
      
      useGameStateStore.getState().dispatchAction({ 
        type: 'BUY_CARD', 
        payload: { playerId: currentPlayer.id, cardId, fromReserved: isFromReserved } 
      });

      const updatedState = useGameStateStore.getState();
      
      useAudioStore.getState().playAudio('card_buy');
      addLog(currentPlayer.name, 'buy', card.name);
      useGameStateStore.getState().setAnimationLocked(true);
      const target = getPlayerTarget();

      if (card.cost) {
          import('../components/common/TokenTransfer').then(({ triggerTokenTransfer }) => {
            Object.entries(card.cost || {}).forEach(([type, count]) => {
              if (count && count > 0) {
                triggerTokenTransfer({
                  tokens: { [type]: count },
                  startX: target.x, startY: target.y,
                  targetSelector: '.public-resource-pool',
                });
              }
            });
          });
      }

      import('../components/common/CardFlight').then(({ spawnCardFlight }) => {
          spawnCardFlight(card, cardX, cardY, target.x, target.y, 'animate-searing-slam');
      });

      const newPatronCount = updatedState.players[state.currentPlayerIndex].patrons.length;
      const oldPatronCount = currentPlayer.patrons.length;
        
      if (newPatronCount > oldPatronCount) {
          useAudioStore.getState().playAudio('patron_visit');
          const newPatron = updatedState.players[state.currentPlayerIndex].patrons[newPatronCount - 1];
          addLog(currentPlayer.name, 'patron', newPatron.name);
          setTimeout(() => {
            import('../components/common/PatronFlight').then(({ spawnPatronFlight }) => {
              spawnPatronFlight(newPatron, window.innerWidth / 2, 100, target.x, target.y);
            });
            handleTurnTransition(2500);
          }, 800);
      } else {
          handleTurnTransition(1500);
      }
    }
    
    if (onCardInteractProp) onCardInteractProp(action, cardId);
  }, [onCardInteractProp, handleTurnTransition, addLog, notify]);

  return { handleConfirmTokens, handleCardInteract, handleDiscardTokens };
}
