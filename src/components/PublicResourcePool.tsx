import React, { useState } from 'react';
import { Token } from './Token';
import type { ResourceType } from './TokenTypes';
import { useAudioStore } from '../store/audioStore';
import { usePublicStore } from '../store/publicStore';
import { usePlayerStore } from '../store/playerStore';
import { ResourceType as DomainResourceType } from '../domain/models';
import { WildcardPool } from './WildcardPool';

const Modal = React.lazy(() => import('./common/Modal').then(m => ({ default: m.Modal })));


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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scale, setScale] = useState(() => {
    if (typeof document !== 'undefined') {
      return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-scale')) || 0.9;
    }
    return 0.9;
  });

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    document.documentElement.style.setProperty('--card-scale', newScale.toString());
  };
  
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
          <React.Suspense fallback={null}>
            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings">
              <div className="flex flex-col gap-2">
                <label className="text-gold text-sm block">Card Scale: {scale.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={scale}
                  onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>
            </Modal>
          </React.Suspense>
        </div>
      </div>
      
      <div className="flex flex-col items-center flex-none">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-fantasy text-sm font-bold text-gold uppercase tracking-wider">Turns</span>
          <div className="w-64 h-2 bg-[#0a0a0f] rounded-full border border-[#bf953f] relative overflow-hidden" title="Turn Tracker (Placeholder)">
            <div className="absolute top-0 left-0 h-full bg-gold w-1/3 shadow-[0_0_5px_#d4af37]"></div>
          </div>
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
          <button 
            className="text-gold p-2 rounded hover:bg-white/10 transition-all hover:scale-105 hover:shadow-[0_0_8px_rgba(212,175,55,0.5)] ml-2"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-end items-center flex-1 pr-4">
      </div>
    </div>
  );
};
