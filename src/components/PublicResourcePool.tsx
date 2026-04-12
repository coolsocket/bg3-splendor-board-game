import React, { useState, useEffect } from 'react';
import { Token, type ResourceType } from './Token';
import './PublicResourcePool.css';
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
  
  const storePlayer = usePlayerStore();
  const totalTokens = Object.values(storePlayer.resources).reduce((sum, count) => sum + (count || 0), 0);
  const isTokenLimitReached = totalTokens >= 10;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scale, setScale] = useState(0.9);

  useEffect(() => {
    const root = document.documentElement;
    const initialScale = parseFloat(getComputedStyle(root).getPropertyValue('--card-scale')) || 0.9;
    setScale(initialScale);
  }, []);

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
    <div className="public-resource-pool global-hud bg-obsidian-panel backdrop-blur-sm flex items-center">
      <div className="hud-left global-info flex items-center gap-4">
        <div className="relative">
          <button 
            className="settings-btn text-gold p-2 rounded hover:bg-white/10"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          {isSettingsOpen && (
            <div className="absolute top-full left-0 mt-2 bg-obsidian-panel border border-gold-dark/30 p-4 rounded-lg z-50 shadow-heavy min-w-[200px]">
              <h3 className="text-gold font-serif mb-2 border-bottom border-gold/20 pb-1">Settings</h3>
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
            </div>
          )}
        </div>
      </div>
      
      <div className="hud-middle flex flex-col items-center">
        <div className="turn-tracker-placeholder w-64 h-2 bg-black/60 rounded-full border border-gold/30 mb-2 relative overflow-hidden" title="Turn Tracker (Placeholder)">
          <div className="absolute top-0 left-0 h-full bg-gold w-1/3 shadow-[0_0_5px_#d4af37]"></div>
        </div>
        <div className={`pool-tokens ${isTokenLimitReached ? 'tokens-disabled' : ''}`}>
          <div className="colored-tokens">
            {resourceTypes.map((type) => (
              <div key={type} className={`token-stack-container stack-${type.toLowerCase()} ${(resources[type] || 0) <= 0 ? 'empty' : ''}`} data-audio-action="take-token">
                <Token
                  type={type}
                  count={resources[type] || 0}
                  onClick={() => onTokenClick && onTokenClick(type)}
                  disabled={disabledTokens.includes(type) || (resources[type] || 0) <= 0}
                  hideLabel={true}
                />
              </div>
            ))}
          </div>
          <div className="pool-separator"></div>
          <div className={`wildcard-token ${(resources['TRUE_SOUL_TADPOLE'] || 0) <= 0 ? 'empty' : ''}`} data-audio-action="take-tadpole">
            <WildcardPool
              count={resources['TRUE_SOUL_TADPOLE'] || 0}
              onClick={() => onTokenClick && onTokenClick('TRUE_SOUL_TADPOLE')}
              disabled={disabledTokens.includes('TRUE_SOUL_TADPOLE') || (resources['TRUE_SOUL_TADPOLE'] || 0) <= 0}
            />
          </div>
        </div>
      </div>


    </div>
  );
};
