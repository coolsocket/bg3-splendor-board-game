import { ResourceType } from '../models';
import type { Player, Card, ResourceCollection } from '../models';
import { calculateEffectiveCost } from '../logic';

/**
 * Calculates the actual cost a player needs to pay in tokens,
 * taking into account bonuses and wildcard (tadpole) usage.
 * Returns the payment collection or null if the player cannot afford it.
 */
export function calculatePurchaseCost(
  player: Player,
  card: Card
): ResourceCollection | null {
  const effectiveCost = calculateEffectiveCost(card, player.bonuses);
  const payment: ResourceCollection = {};
  const tadpoles = player.resources[ResourceType.TRUE_SOUL_TADPOLE] || 0;
  let tadpolesNeeded = 0;
  
  for (const [type, needed] of Object.entries(effectiveCost)) {
    const resourceType = type as ResourceType;
    if (resourceType === ResourceType.TRUE_SOUL_TADPOLE) continue;
    
    const available = player.resources[resourceType] || 0;
    if (available >= (needed || 0)) {
      payment[resourceType] = needed;
    } else {
      payment[resourceType] = available;
      tadpolesNeeded += (needed || 0) - available;
    }
  }
  
  if (tadpolesNeeded > tadpoles) {
    return null; // Cannot afford
  }
  
  if (tadpolesNeeded > 0) {
    payment[ResourceType.TRUE_SOUL_TADPOLE] = tadpolesNeeded;
  }
  
  return payment;
}

/**
 * Checks if a player can afford a card.
 */
export function canAffordCard(player: Player, card: Card): boolean {
  return calculatePurchaseCost(player, card) !== null;
}

/**
 * Calculates exactly which resources the player is missing to buy the card.
 * Handles wildcard (tadpole) logic by subtracting them from missing deficits.
 */
export function calculateMissingResources(player: Player, card: Card): { type: ResourceType; amount: number }[] {
  const effectiveCost = calculateEffectiveCost(card, player.bonuses);
  let tadpolesLeft = player.resources[ResourceType.TRUE_SOUL_TADPOLE] || 0;
  const missing: { type: ResourceType; amount: number }[] = [];
  
  for (const [type, needed] of Object.entries(effectiveCost)) {
    const resourceType = type as ResourceType;
    if (resourceType === ResourceType.TRUE_SOUL_TADPOLE) continue;
    
    const available = player.resources[resourceType] || 0;
    if (available < (needed || 0)) {
      const deficit = (needed || 0) - available;
      missing.push({ type: resourceType, amount: deficit });
    }
  }

  // Deduct tadpoles from missing requirements
  const finalMissing: { type: ResourceType; amount: number }[] = [];
  for (const m of missing) {
    if (tadpolesLeft > 0) {
      if (tadpolesLeft >= m.amount) {
        tadpolesLeft -= m.amount;
      } else {
        finalMissing.push({ type: m.type, amount: m.amount - tadpolesLeft });
        tadpolesLeft = 0;
      }
    } else {
      finalMissing.push(m);
    }
  }
  
  return finalMissing;
}
