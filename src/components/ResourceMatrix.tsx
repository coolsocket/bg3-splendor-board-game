import React from 'react';
import type { ResourceType } from './TokenTypes';
import { ResourceIcon } from './common/ResourceIcon';
import { useUIStore } from '../store/uiStore';

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
  const setSettingsOpen = useUIStore((state) => state.setSettingsOpen);
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-md">
      {regularResourceTypes.map(type => {
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
      <div className="flex items-center justify-between font-serif text-base text-[#e2e8f0] w-full border-t border-white/10 pt-1 mt-1 transition-opacity duration-200 opacity-100" data-resource-type="TRUE_SOUL_TADPOLE">
        <div className="flex items-center gap-1">
          <ResourceIcon type="TRUE_SOUL_TADPOLE" size="lg" className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          <span className="text-[#64748b]">:</span>
          <span className="font-bold text-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-2xl text-white">
            <span>{tokens['TRUE_SOUL_TADPOLE'] || 0}</span>
            <span> / 0</span>
          </span>
        </div>
        <button 
          className="text-gold p-1 rounded hover:bg-white/10 transition-all hover:scale-105 hover:shadow-[0_0_8px_rgba(212,175,55,0.5)]"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
