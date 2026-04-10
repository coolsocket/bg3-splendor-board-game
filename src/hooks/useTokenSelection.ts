import { useState, useCallback } from 'react';
import { ResourceType, type ResourceCollection } from '../domain/models';

export function useTokenSelection(availableResources: ResourceCollection, playerTotalTokens: number) {
  const [selectedTokens, setSelectedTokens] = useState<ResourceCollection>({});

  const totalSelected = Object.values(selectedTokens).reduce((sum, count) => sum + (count || 0), 0);
  const selectedTypes = Object.keys(selectedTokens).filter((type) => (selectedTokens[type as ResourceType] || 0) > 0) as ResourceType[];

  const isValid = (() => {
    if (totalSelected === 3 && selectedTypes.length === 3) return true;
    if (totalSelected === 2 && selectedTypes.length === 1) {
      const type = selectedTypes[0];
      const available = availableResources[type] || 0;
      return available >= 4;
    }
    return false;
  })();

  const canSelect = useCallback((type: ResourceType) => {
    if (type === ResourceType.TRUE_SOUL_TADPOLE) return false; // Cannot take tadpoles directly
    if (playerTotalTokens + totalSelected >= 10) return false; // Max 10 tokens
    
    const currentCount = selectedTokens[type] || 0;
    const available = availableResources[type] || 0;
    
    if (available <= currentCount) return false; // Not enough in pool
    
    if (totalSelected === 0) return true;
    
    if (selectedTypes.length === 1 && totalSelected === 1) {
      if (selectedTypes.includes(type)) {
        // Trying to take a second of the same color
        return available >= 4;
      }
      // Trying to take a different color
      return true;
    }
    
    if (selectedTypes.length === 2 && totalSelected === 2) {
      // Can only select a 3rd different color
      return !selectedTypes.includes(type);
    }
    
    return false;
  }, [selectedTokens, availableResources, playerTotalTokens, totalSelected, selectedTypes]);

  const selectToken = useCallback((type: ResourceType) => {
    if (!canSelect(type)) return;
    
    setSelectedTokens((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));
  }, [canSelect]);

  const deselectToken = useCallback((type: ResourceType) => {
    setSelectedTokens((prev) => {
      const currentCount = prev[type] || 0;
      if (currentCount <= 0) return prev;
      const next = { ...prev };
      if (currentCount === 1) {
        delete next[type];
      } else {
        next[type] = currentCount - 1;
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTokens({});
  }, []);

  return {
    selectedTokens,
    selectToken,
    deselectToken,
    clearSelection,
    isValid,
    canSelect,
    totalSelected,
  };
}
