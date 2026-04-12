import React from 'react';
import './ResourceMatrix.css';
import { type ResourceType } from './Token';
import { ResourceIcon } from './common/ResourceIcon';

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

export const ResourceMatrix: React.FC<ResourceMatrixProps> = ({ tokens, bonuses }) => {
  return (
    <div className="resource-matrix-grid">
      {regularResourceTypes.map(type => (
        <div key={type} className="resource-matrix-item">
          <ResourceIcon type={type} />
          <span className="resource-divider">:</span>
          <span className="resource-values">
            <span>{tokens[type] || 0}</span>
            {bonuses[type] > 0 ? (
              <span> / {bonuses[type]}</span>
            ) : (
              <span className="opacity-30"> / 0</span>
            )}
          </span>
        </div>
      ))}
      <div className="resource-matrix-item wildcard">
        <ResourceIcon type="TRUE_SOUL_TADPOLE" />
        <span className="resource-divider">:</span>
        <span className="resource-values">
          <span>{tokens['TRUE_SOUL_TADPOLE'] || 0}</span>
          <span className="opacity-30"> / 0</span>
        </span>
      </div>
    </div>
  );
};
