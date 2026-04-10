import { useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { type Card, ResourceType } from '../domain/models';
import { calculateEffectiveCost } from '../domain/logic';

export function useCardPurchase() {
  const player = usePlayerStore();

  const canAfford = useCallback((card: Card) => {
    const effectiveCost = calculateEffectiveCost(card, player.bonuses);
    
    const totalResources = { ...player.resources };
    const tadpoles = totalResources[ResourceType.TRUE_SOUL_TADPOLE] || 0;
    
    let tadpolesNeeded = 0;
    
    for (const [type, needed] of Object.entries(effectiveCost)) {
      const resourceType = type as ResourceType;
      const available = totalResources[resourceType] || 0;
      if (available < (needed || 0)) {
        tadpolesNeeded += (needed || 0) - available;
      }
    }
    
    return tadpolesNeeded <= tadpoles;
  }, [player.resources, player.bonuses]);

  const canReserve = useCallback(() => {
    return player.reservedCards.length < 3;
  }, [player.reservedCards.length]);

  return {
    canAfford,
    canReserve,
  };
}
