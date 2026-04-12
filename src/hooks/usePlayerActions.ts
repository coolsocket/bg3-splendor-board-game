import { useCallback } from 'react';
import { useEventLogStore } from '../store/eventLogStore';
import { usePublicStore } from '../store/publicStore';
import { ResourceType, type ResourceCollection } from '../domain/models';

export function usePlayerActions({
  playerName,
  selectedTokens,
  clearSelection,
  onCardInteractProp
}: {
  playerName: string;
  selectedTokens: ResourceCollection;
  clearSelection: () => void;
  onCardInteractProp?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}) {
  const handleConfirmTokens = useCallback(() => {
    console.log('Confirmed token selection:', selectedTokens);
    const eventLogStore = useEventLogStore.getState();
    eventLogStore.addEvent(`${playerName} took tokens: ${JSON.stringify(selectedTokens)}`);
    // Here we would normally send action to network manager
    clearSelection();
  }, [playerName, selectedTokens, clearSelection]);

  const handleCardInteract = useCallback((action: 'buy' | 'reserve' | 'select', cardId: string) => {
    const eventLogStore = useEventLogStore.getState();
    
    if (action === 'reserve') {
      eventLogStore.addEvent(`${playerName} reserved card ${cardId}`);
      // STORY-333: Implement wild card auto-trigger
      const publicStore = usePublicStore.getState();
      const tadpoleCount = publicStore.availableResources[ResourceType.TRUE_SOUL_TADPOLE] || 0;
      if (tadpoleCount > 0) {
        eventLogStore.addEvent(`Auto-triggered Wildcard (Tadpole) from pool`);
        // Logic placeholder: in a real app we would update stores or send network action
      }
    } else if (action === 'buy') {
      eventLogStore.addEvent(`${playerName} bought card ${cardId}`);
    }
    
    if (onCardInteractProp) {
      onCardInteractProp(action, cardId);
    }
  }, [playerName, onCardInteractProp]);

  return {
    handleConfirmTokens,
    handleCardInteract,
  };
}
