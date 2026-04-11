import React from 'react';
import './ResourceMatrix.css';
import { Token, type ResourceType } from './Token';

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
    <div className="asset-matrix grid grid-cols-6 gap-1 w-full max-w-full">
      {resourceTypes.map(type => (
        <Token key={`token-${type}`} type={type} count={tokens[type] || 0} />
      ))}
      {resourceTypes.map(type => (
        <div key={`bonus-${type}`} className={`bonus-item ${type.toLowerCase()}`} title={`Bonus: ${bonuses[type] || 0}`}>
          <span className="bonus-value">{bonuses[type] || 0}</span>
        </div>
      ))}
    </div>
  );
};
