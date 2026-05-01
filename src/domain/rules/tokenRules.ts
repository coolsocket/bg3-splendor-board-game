import { ResourceType } from '../models';
import type { ResourceCollection } from '../models';

/**
 * Validates if a selection of tokens is allowed to be taken.
 */
export function validateTokenTake(
  selectedTokens: ResourceCollection,
  availableResources: ResourceCollection
): boolean {
  const totalSelected = Object.values(selectedTokens).reduce((sum, count) => sum + (count || 0), 0);
  const selectedTypes = Object.keys(selectedTokens).filter((type) => (selectedTokens[type as ResourceType] || 0) > 0) as ResourceType[];

  // Pattern 1: 3 different colors
  if (totalSelected === 3 && selectedTypes.length === 3) return true;
  
  // Pattern 2: 2 of the same color (only if pool >= 4)
  if (totalSelected === 2 && selectedTypes.length === 1) {
    const type = selectedTypes[0];
    const available = availableResources[type] || 0;
    return available >= 4;
  }
  
  // Special case: taking less than 3 because bank is almost empty
  const bankUniqueTypes = Object.keys(availableResources).filter(t => 
    t !== ResourceType.TRUE_SOUL_TADPOLE && (availableResources[t as ResourceType] || 0) > 0
  );
  
  if (totalSelected > 0 && totalSelected < 3 && selectedTypes.length === totalSelected) {
      // If we are taking all available different types and it's less than 3
      if (bankUniqueTypes.length === totalSelected) return true;
  }

  return false;
}

/**
 * Checks if a specific token can be selected.
 */
export function canSelectToken(
  type: ResourceType,
  selectedTokens: ResourceCollection,
  availableResources: ResourceCollection
): boolean {
  if (type === ResourceType.TRUE_SOUL_TADPOLE) return false;
  
  const totalSelected = Object.values(selectedTokens).reduce((sum, count) => sum + (count || 0), 0);
  const selectedTypes = Object.keys(selectedTokens).filter((t) => (selectedTokens[t as ResourceType] || 0) > 0) as ResourceType[];

  const available = availableResources[type] || 0;
  const currentCount = selectedTokens[type] || 0;
  
  // 1. Pool availability
  if (available <= currentCount) return false;
  
  // 2. Selection patterns
  if (totalSelected === 0) return true;
  
  // If we already selected some tokens, check if the new one matches the patterns
  if (selectedTypes.length === 1 && totalSelected === 1) {
    if (selectedTypes.includes(type)) {
        return available >= 4; // Can take 2nd only if 4+ in bank
    }
    return true; // Start of "3 different"
  }
  
  if (selectedTypes.length === 1 && totalSelected === 2) {
    return false; // Already taking 2 of same, cannot take more
  }

  if (selectedTypes.length >= 2) {
    if (selectedTypes.includes(type)) return false; // Already selected this type
    return totalSelected < 3; // Max 3 different
  }
  
  return false;
}
