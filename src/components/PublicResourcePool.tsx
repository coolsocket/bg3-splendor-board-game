import React from 'react';
import type { ResourceType } from './TokenTypes';
import { useGameStateStore } from '../store/gameStateStore';
import { usePlayerStore } from '../store/playerStore';
import { ResourceType as DomainResourceType } from '../domain/models';
import { UnifiedToken } from './common/UnifiedToken';

interface PublicResourcePoolProps {
  onTokenClick?: (type: ResourceType, x: number, y: number) => void;
  disabledTokens?: ResourceType[];
}

export const PublicResourcePool: React.FC<PublicResourcePoolProps> = ({
  onTokenClick,
  disabledTokens = [],
}) => {
  const { availableResources, players, currentPlayerIndex } = useGameStateStore();
  const localPlayerName = usePlayerStore((state) => state.name);
  const storeResources = availableResources;
  
  // Important: Find the LOCAL player to determine if they personally can take tokens
  // not based on whose turn it is for UI feedback (though turn logic will still block the action)
  const localPlayer = players.find(p => p.name === localPlayerName) || players[currentPlayerIndex];
  const totalTokens = Object.values(localPlayer.resources).reduce((sum, count) => sum + (count || 0), 0);
  const isTokenLimitReached = totalTokens >= 10;
  
  // Interaction check: only active if it's the local player's turn
  const isMyTurn = players[currentPlayerIndex]?.name === localPlayerName;

  const resources: Record<ResourceType, number> = {
    RADIANT_GEM: storeResources[DomainResourceType.RADIANT_GEM] || 0,
    ARCANE_CRYSTAL: storeResources[DomainResourceType.ARCANE_CRYSTAL] || 0,
    NATURES_BLESSING: storeResources[DomainResourceType.NATURES_BLESSING] || 0,
    INFERNAL_IRON: storeResources[DomainResourceType.INFERNAL_IRON] || 0,
    DARK_QUARTZ: storeResources[DomainResourceType.DARK_QUARTZ] || 0,
    TRUE_SOUL_TADPOLE: storeResources[DomainResourceType.TRUE_SOUL_TADPOLE] || 0,
  };

  const resourceTypes: ResourceType[] = [
    'RADIANT_GEM',
    'ARCANE_CRYSTAL',
    'NATURES_BLESSING',
    'INFERNAL_IRON',
    'DARK_QUARTZ',
  ];

  return (
    <div className="public-resource-pool flex flex-col items-center w-full bg-gradient-to-br from-bg-underdark/95 to-bg-underdark-end/95 border-b-2 border-gold-dark/30 shadow-heavy z-elevated global-hud backdrop-blur-sm pb-4 rounded-lg">
      <div className="flex flex-col items-center w-full px-2 pt-4">
        {/* Public Vault (Token Pool Pedestal) */}
        <div className={`flex flex-col items-center w-full max-w-60 ${(!isMyTurn || isTokenLimitReached) ? 'filter grayscale-[100%] opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-ui-bg-vault p-3 rounded-xl border border-gold/50 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_8px_16px_rgba(0,0,0,0.6)] relative flex flex-col items-center w-full">
            {/* Metallic top trim */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-70"></div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 place-items-center w-full mt-2">
              {resourceTypes.map((type) => (
                <div 
                  key={type} 
                  data-testid={`token-${type}`}
                  className={`flex flex-col items-center relative transition-all duration-200 cursor-pointer rounded-full shadow-md hover:scale-110 aspect-square min-w-[2rem] flex-shrink-0 ${(resources[type] || 0) <= 0 ? 'filter grayscale-[100%] brightness-50 cursor-not-allowed pointer-events-none' : ''} ${
                    type === 'RADIANT_GEM' ? 'hover:shadow-[0_0_15px_var(--color-radiant)]' :
                    type === 'ARCANE_CRYSTAL' ? 'hover:shadow-[0_0_15px_var(--color-arcane)]' :
                    type === 'NATURES_BLESSING' ? 'hover:shadow-[0_0_15px_var(--color-natures)]' :
                    type === 'INFERNAL_IRON' ? 'hover:shadow-[0_0_15px_var(--color-infernal)]' :
                    type === 'DARK_QUARTZ' ? 'hover:shadow-[0_0_15px_var(--color-dark)]' : ''
                  }`}
                >
                  <UnifiedToken
                    type={type}
                    amount={resources[type] || 0}
                    onClick={(e) => {
                      if (!isMyTurn) return;
                      onTokenClick?.(type, e.clientX, e.clientY);
                    }}
                    disabled={!isMyTurn || disabledTokens.includes(type) || (resources[type] || 0) <= 0}
                    size="md"
                    interactive={isMyTurn}
                  />
                </div>
              ))}

              {/* Wildcard */}
              <div 
                data-testid="token-TRUE_SOUL_TADPOLE"
                className={`flex items-center ${(resources['TRUE_SOUL_TADPOLE'] || 0) <= 0 ? 'filter grayscale-[100%] brightness-50 cursor-not-allowed pointer-events-none' : ''} hover:scale-110 transition-all duration-200 hover:shadow-[0_0_15px_var(--color-wildcard)] rounded-full`}
              >
                <UnifiedToken
                  type="TRUE_SOUL_TADPOLE"
                  amount={resources['TRUE_SOUL_TADPOLE'] || 0}
                  onClick={(e) => {
                    if (!isMyTurn) return;
                    onTokenClick?.('TRUE_SOUL_TADPOLE', e.clientX, e.clientY);
                  }}
                  disabled={!isMyTurn || disabledTokens.includes('TRUE_SOUL_TADPOLE') || (resources['TRUE_SOUL_TADPOLE'] || 0) <= 0}
                  size="md"
                  interactive={isMyTurn}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
