import React from 'react';
import type { ResourceType } from './TokenTypes';
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
  const isTadpoleZero = (tokens['TRUE_SOUL_TADPOLE'] || 0) === 0;
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-md">
      {regularResourceTypes.map(type => {
        const isZero = (tokens[type] || 0) === 0 && (bonuses[type] || 0) === 0;
        return (
          <div key={type} className="flex items-center gap-1 font-serif text-base text-[#e2e8f0] transition-opacity duration-200 opacity-100" data-resource-type={type}>
            <ResourceIcon type={type} size="lg" className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <span className="text-[#64748b]">:</span>
            <span className="font-bold text-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-2xl text-white">
              <span>{tokens[type] || 0}</span>
              {bonuses[type] > 0 ? (
                <span className="text-[#ffd700]"> / {bonuses[type]}</span>
              ) : (
                <span> / 0</span>
              )}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-1 font-serif text-base text-[#e2e8f0] w-full border-t border-white/10 pt-1 mt-1 transition-opacity duration-200 opacity-100" data-resource-type="TRUE_SOUL_TADPOLE">
        <ResourceIcon type="TRUE_SOUL_TADPOLE" size="lg" className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        <span className="text-[#64748b]">:</span>
        <span className="font-bold text-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-2xl text-white">
          <span>{tokens['TRUE_SOUL_TADPOLE'] || 0}</span>
          <span> / 0</span>
        </span>
      </div>
    </div>
  );
};
