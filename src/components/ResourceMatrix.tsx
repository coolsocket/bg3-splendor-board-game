import React from 'react';
import './ResourceMatrix.css';
import { type ResourceType } from './Token';

interface ResourceMatrixProps {
  tokens: Record<ResourceType, number>;
  bonuses: Record<ResourceType, number>;
}

const regularResourceTypes: ResourceType[] = [
  'RADIANT_GEM',
  'ARCANE_CRYSTAL',
  'NATURES_BLESSING',
  'INFERNAL_IRON',
  'DARK_QUARTZ'
];

const resourceIcons: Record<ResourceType, string> = {
  RADIANT_GEM: '☀️',
  ARCANE_CRYSTAL: '🔮',
  NATURES_BLESSING: '🍃',
  INFERNAL_IRON: '🔥',
  DARK_QUARTZ: '🌑',
  TRUE_SOUL_TADPOLE: '⭐'
};

export const ResourceMatrix: React.FC<ResourceMatrixProps> = ({ tokens, bonuses }) => {
  return (
    <div className="resource-matrix-container flex flex-col gap-2 w-full">
      {/* Tokens Row */}
      <div className="tokens-row flex items-center gap-1">
        {regularResourceTypes.map(type => (
          <div key={`token-${type}`} className="resource-item flex flex-col items-center">
            <div className={`token-shape circle ${type.toLowerCase()}`} title={`Token: ${type}`}>
              <span className="icon-watermark">{resourceIcons[type]}</span>
              <span className="count-text">{tokens[type] || 0}</span>
            </div>
          </div>
        ))}
        {/* Wildcard Token */}
        <div className="wildcard-separator" />
        <div className="resource-item flex flex-col items-center">
          <div className="token-shape circle true_soul_tadpole" title="Wildcard: TRUE_SOUL_TADPOLE">
            <span className="icon-watermark">{resourceIcons['TRUE_SOUL_TADPOLE']}</span>
            <span className="count-text">{tokens['TRUE_SOUL_TADPOLE'] || 0}</span>
          </div>
        </div>
      </div>

      {/* Bonuses Row */}
      <div className="bonuses-row flex items-center gap-1">
        {regularResourceTypes.map(type => (
          <div key={`bonus-${type}`} className="resource-item flex flex-col items-center">
            <div className={`bonus-shape square ${type.toLowerCase()}`} title={`Bonus: ${type}`}>
              <span className="icon-watermark">{resourceIcons[type]}</span>
              <span className="count-text">{bonuses[type] || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
