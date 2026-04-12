import React from 'react';
import { Token } from './Token';
import type { ResourceType } from './TokenTypes';
import { useAudioStore } from '../store/audioStore';
import { usePublicStore } from '../store/publicStore';
import { usePlayerStore } from '../store/playerStore';
import { ResourceType as DomainResourceType } from '../domain/models';
import { WildcardPool } from './WildcardPool';




interface PublicResourcePoolProps {
  onTokenClick?: (type: ResourceType) => void;
  disabledTokens?: ResourceType[];
}

export const PublicResourcePool: React.FC<PublicResourcePoolProps> = ({
  onTokenClick,
  disabledTokens = [],
}) => {
  const storeResources = usePublicStore((state) => state.availableResources);
  const playAudio = useAudioStore((state) => state.playAudio);
  
  const storePlayer = usePlayerStore();
  const totalTokens = Object.values(storePlayer.resources).reduce((sum, count) => sum + (count || 0), 0);
  const isTokenLimitReached = totalTokens >= 10;


  
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
    <div className="public-resource-pool flex justify-between items-center py-2 bg-gradient-to-br from-[#1a1c23]/95 to-[#101216]/95 border-b-2 border-gold-dark/30 shadow-heavy z-elevated global-hud backdrop-blur-sm">
      <div className="flex items-center gap-4 flex-1 global-info">
        <div className="relative">
        </div>
      </div>
      
      <div className="flex flex-col items-center flex-none">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-fantasy text-sm font-bold text-gold uppercase tracking-wider">Turns</span>
          <div className="w-64 h-2 bg-[#0a0a0f] rounded-full border border-[#bf953f] relative overflow-hidden" title="Turn Tracker (Placeholder)">
            <div className="absolute top-0 left-0 h-full bg-gold w-1/3 shadow-[0_0_5px_#d4af37]"></div>
          </div>
          <span className="text-xs text-gold/70 ml-1" aria-label="Turn Progress">Turn Progress</span>
        </div>
        <div className={`flex items-center gap-6 ${isTokenLimitReached ? 'filter grayscale-[100%] opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-[#0a0a0f] p-3 rounded-xl border border-[#bf953f]/40 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
            <div className="flex gap-3">
              {resourceTypes.map((type) => (
                <div 
                  key={type} 
                  className={`flex flex-col items-center relative transition-all duration-200 cursor-pointer rounded-full shadow-md hover:scale-110 aspect-square min-w-[2rem] flex-shrink-0 ${(resources[type] || 0) <= 0 ? 'filter grayscale-[100%] brightness-50 cursor-not-allowed pointer-events-none' : ''} ${
                    type === 'RADIANT_GEM' ? 'hover:shadow-[0_0_15px_var(--color-radiant)]' :
                    type === 'ARCANE_CRYSTAL' ? 'hover:shadow-[0_0_15px_var(--color-arcane)]' :
                    type === 'NATURES_BLESSING' ? 'hover:shadow-[0_0_15px_var(--color-natures)]' :
                    type === 'INFERNAL_IRON' ? 'hover:shadow-[0_0_15px_var(--color-infernal)]' :
                    type === 'DARK_QUARTZ' ? 'hover:shadow-[0_0_15px_var(--color-dark)]' : ''
                  }`}
                >
                  <Token
                    type={type}
                    count={resources[type] || 0}
                    onClick={() => {
                      playAudio('take-token');
                      onTokenClick?.(type);
                    }}
                    disabled={disabledTokens.includes(type) || (resources[type] || 0) <= 0}
                    hideLabel={true}
                    size="lg"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gold/15 p-2 rounded-full border border-gold/50 shadow-md">
            <div className={`flex items-center ${(resources['TRUE_SOUL_TADPOLE'] || 0) <= 0 ? 'filter grayscale-[100%] brightness-50 cursor-not-allowed pointer-events-none' : ''} hover:scale-110 transition-all duration-200 hover:shadow-[0_0_15px_var(--color-wildcard)] rounded-full`}>
              <WildcardPool
                count={resources['TRUE_SOUL_TADPOLE'] || 0}
                onClick={() => {
                  playAudio('take-tadpole');
                  onTokenClick?.('TRUE_SOUL_TADPOLE');
                }}
                disabled={disabledTokens.includes('TRUE_SOUL_TADPOLE') || (resources['TRUE_SOUL_TADPOLE'] || 0) <= 0}
                size="lg"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end items-center flex-1 pr-4">
      </div>
    </div>
  );
};
