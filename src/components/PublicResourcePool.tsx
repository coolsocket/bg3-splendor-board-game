import React from 'react';
import { Token, type ResourceType } from './Token';
import './PublicResourcePool.css';
import { usePublicStore } from '../store/publicStore';
import { usePlayerStore } from '../store/playerStore';
import { ResourceType as DomainResourceType } from '../domain/models';
import { WildcardPool } from './WildcardPool';
import { PatronSlot } from './PatronSlot';

interface PublicResourcePoolProps {
  onTokenClick?: (type: ResourceType) => void;
  disabledTokens?: ResourceType[];
}

export const PublicResourcePool: React.FC<PublicResourcePoolProps> = ({
  onTokenClick,
  disabledTokens = [],
}) => {
  const storeResources = usePublicStore((state) => state.availableResources);
  const availablePatrons = usePublicStore((state) => state.availablePatrons);
  
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
    <div className="public-resource-pool global-hud bg-obsidian-panel backdrop-blur-sm flex items-center">
      <div className="hud-left global-info">
        <span className="room-number text-gold">Room: #12345</span>
        <span className="target-score text-gold">Target: 15</span>
        <button className="settings-btn text-gold">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
      
      <div className={`hud-middle pool-tokens ${isTokenLimitReached ? 'tokens-disabled' : ''}`}>
        <div className="colored-tokens">
          {resourceTypes.map((type) => (
            <div key={type} className={`token-stack-container stack-${type.toLowerCase()}`}>
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
        <div className="wildcard-token">
          <WildcardPool
            count={resources['TRUE_SOUL_TADPOLE'] || 0}
            onClick={() => onTokenClick && onTokenClick('TRUE_SOUL_TADPOLE')}
            disabled={disabledTokens.includes('TRUE_SOUL_TADPOLE') || (resources['TRUE_SOUL_TADPOLE'] || 0) <= 0}
          />
        </div>
      </div>

      <div className="hud-right patron-area-horizontal">
        {availablePatrons.map(patron => (
          <PatronSlot key={patron.id} patron={patron} />
        ))}
        {Array.from({ length: Math.max(0, 4 - availablePatrons.length) }).map((_, i) => (
          <PatronSlot key={`empty-${i}`} />
        ))}
      </div>
    </div>
  );
};
