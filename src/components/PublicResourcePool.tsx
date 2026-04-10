import React from 'react';
import { Token, type ResourceType } from './Token';
import './PublicResourcePool.css';
import { usePublicStore } from '../store/publicStore';
import { ResourceType as DomainResourceType } from '../domain/models';

interface PublicResourcePoolProps {
  resources?: Record<ResourceType, number>;
  onTokenClick?: (type: ResourceType) => void;
  disabledTokens?: ResourceType[];
}

export const PublicResourcePool: React.FC<PublicResourcePoolProps> = ({
  onTokenClick,
  disabledTokens = [],
}) => {
  const storeResources = usePublicStore((state) => state.availableResources);
  
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
    'TRUE_SOUL_TADPOLE',
  ];

  return (
    <div className="public-resource-pool bg-obsidian-panel backdrop-blur-sm">
      <div className="pool-header">
        <h3 className="pool-title text-parchment">Public Resource Pool</h3>
      </div>
      <div className="pool-tokens">
        {resourceTypes.map((type, index) => (
          <React.Fragment key={type}>
            <div className={`token-stack-container stack-${type.toLowerCase()}`}>
              <Token
                type={type}
                count={resources[type] || 0}
                onClick={() => onTokenClick && onTokenClick(type)}
                disabled={disabledTokens.includes(type) || (resources[type] || 0) <= 0}
              />
            </div>
            {index === 0 && <div className="pool-separator"></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
