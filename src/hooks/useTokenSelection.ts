import { useState, useCallback } from 'react';
import { ResourceType, type ResourceCollection } from '../domain/models';
import { canSelectToken, validateTokenTake } from '../domain/rules/tokenRules';
import { useAudioStore } from '../store/audioStore';

export function useTokenSelection(availableResources: ResourceCollection) {
  const [selectedTokens, setSelectedTokens] = useState<ResourceCollection>({});
  const [tokenOrigins, setTokenOrigins] = useState<Partial<Record<ResourceType, { x: number, y: number }>>>({});

  const totalSelected = Object.values(selectedTokens).reduce((sum, count) => sum + (count || 0), 0);
  
  const isValid = validateTokenTake(selectedTokens, availableResources);

  const canSelect = useCallback((type: ResourceType) => {
    return canSelectToken(type, selectedTokens, availableResources);
  }, [selectedTokens, availableResources]);

  const selectToken = useCallback((type: ResourceType, x?: number, y?: number) => {
    if (!canSelect(type)) {
      useAudioStore.getState().playAudio('error_thud');
      return;
    }
    
    useAudioStore.getState().playAudio('gem_clink');
    
    setSelectedTokens((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    if (x !== undefined && y !== undefined) {
      setTokenOrigins(prev => ({
        ...prev,
        [type]: { x, y }
      }));
    }
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
    setTokenOrigins({});
  }, []);

  return {
    selectedTokens,
    tokenOrigins,
    selectToken,
    deselectToken,
    clearSelection,
    isValid,
    canSelect,
    totalSelected,
  };
}
