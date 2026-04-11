import React from 'react';
import './ResourceMatrix.css';
import { type ResourceType } from './Token';

interface ResourceMatrixProps {
  tokens: Record<ResourceType, number>;
  bonuses: Record<ResourceType, number>;
}

const resourceTypes: ResourceType[] = [
  'RADIANT_GEM',
  'ARCANE_CRYSTAL',
  'NATURES_BLESSING',
  'INFERNAL_IRON',
  'DARK_QUARTZ',
  'TRUE_SOUL_TADPOLE'
];

export const ResourceMatrix: React.FC<ResourceMatrixProps> = ({ tokens, bonuses }) => {
  return (
    <div className="asset-matrix grid grid-cols-3 gap-x-2 gap-y-1 w-full max-w-full">
      {resourceTypes.map(type => (
        <div key={`asset-${type}`} className="asset-item flex items-center">
          <div className={`color-icon ${type.toLowerCase()}`} />
          <span className="asset-text ml-1 text-sm font-bold text-white">
            : {tokens[type] || 0} / {bonuses[type] || 0}
          </span>
        </div>
      ))}
    </div>
  );
};
